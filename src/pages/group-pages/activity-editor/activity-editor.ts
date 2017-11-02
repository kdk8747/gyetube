import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { UtilService, ActivityService, DecisionService, AmazonService } from '../../../providers';
import { Activity, Decision, AmazonSignature } from '../../../models';
import { Observable } from 'rxjs/Observable';


@IonicPage({
  segment: 'editor'
})
@Component({
  selector: 'page-activity-editor',
  templateUrl: 'activity-editor.html',
})
export class ActivityEditorPage {

    groupId: string;
    isNative: boolean = false;
    newActivityFiles: File[];
    //previewSrc: string = '';
    decisions: Observable<Decision[]>;
    activitySelected: boolean = true;

    activityDate: string = new Date().toUTCString();
    elapsedTime: number = 0;
    title: string = '';
    description: string = '';
    parentDecision: string = '';

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private photoLibrary: PhotoLibrary,
      public util: UtilService,
      public activityService: ActivityService,
      public decisionService: DecisionService,
      public amazonService: AmazonService
    ) {
    }

    ionViewDidLoad() {
      this.groupId = this.util.getCurrentGroupId();
      this.isNative = this.util.isNativeApp();

      this.decisions = this.decisionService.getDecisions(this.groupId);

      this.photoLibrary.requestAuthorization().then(() => {
        this.photoLibrary.getLibrary().subscribe({
          next: library => {
            library.forEach(function (libraryItem) {
              console.log(libraryItem.id);          // ID of the photo
              console.log(libraryItem.photoURL);    // Cross-platform access to photo
              console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
              console.log(libraryItem.fileName);
              console.log(libraryItem.width);
              console.log(libraryItem.height);
              console.log(libraryItem.creationDate);
              console.log(libraryItem.latitude);
              console.log(libraryItem.longitude);
              console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
            });
          },
          error: err => { console.log('could not get photos'); },
          complete: () => { console.log('done getting photos'); }
        });
      })
        .catch(err => console.log('permissions weren\'t granted'));
    }

    popNavigation() {
      if (this.navCtrl.length() == 1)
        this.navCtrl.setRoot('ReceiptListPage');
      else
        this.navCtrl.pop();
    }

    onChangeActivityPhotos(event: any) {
      let fileList = event.target.files;
      this.newActivityFiles = [];
      for (let i = 0; i < fileList.length; i++) {
          this.newActivityFiles.push(event.target.files[i] as File);
      }
      /*
      this.newActivityImageFile = event.target.files[0] as File;

      let preview = document.querySelector('img');
      let file: File = this.newActivityImageFile;
      let reader = new FileReader();

      reader.onloadend = function () {
        preview.src = reader.result;
      }

      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
      }*/
    }

    onNewReceipt(): void {
      if (!this.parentDecision || !this.activityDate || this.elapsedTime < 0 || !this.title || !this.description) return;
      this.title = this.title.trim();
      console.log(this.activityDate);

      let newActivity = new Activity(0, new Date(Date.now()).toISOString(), this.activityDate, '',
          [], this.elapsedTime, this.title, this.description, [], [],
          +this.parentDecision, [], 0);

      let dateForSign = this.amazonService.getISO8601Date(new Date(Date.now()));
      let amzSignForPhoto: AmazonSignature = null;
      this.amazonService.getAmazonSignatureForPhotoPOST(this.groupId, dateForSign).toPromise()
          .then((amzSign: AmazonSignature) => {
              amzSignForPhoto = amzSign;
              return this.amazonService.getAmazonSignatureForDocumentPOST(this.groupId, dateForSign).toPromise();
          })
          .then((amzSignForDocument: AmazonSignature) => Promise.all(this.newActivityFiles.map(file => {
              let amzSign = file.type.substr(0, 5) == 'image' ? amzSignForPhoto : amzSignForDocument;
              return this.amazonService.postFile(file, dateForSign, amzSign).toPromise()
                  .then((xml: string) => {
                      let regexp = /<Location>(.+)<\/Location>/;
                      let result = regexp.exec(xml);
                      if (result.length < 2) return Promise.reject('Unknown XML format');

                      if (file.type.substr(0, 5) == 'image')
                          newActivity.imageUrls.push(result[1]);
                      else
                          newActivity.documentUrls.push(result[1]);
                      return Promise.resolve();
                  })
          })))
          .then(() => this.activityService.create(this.groupId, newActivity).toPromise())
          .then(() => {
              this.popNavigation();
          })
          .catch(() => { console.log('new receipt failed') });

    }
}
