import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the LeaderBoardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leader-board',
  templateUrl: 'leader-board.html',
})
export class LeaderBoardPage {

  public result;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
  }

  ionViewDidLoad() {
    this.getLeaderBoard();
  }

  getLeaderBoard(){
    this.restProvider.getLeaderBoard().then(data=>{
      this.result = (data as any).sort(function(obj1, obj2) {
        // Ascending: first age less than the previous
        return obj1.score + obj2.score;
      });
      console.log(this.result);
    });
  }

}