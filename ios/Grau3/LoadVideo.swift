//
//  LoadVideo.swift
//  Grau3
//
//  Created by Tom Chambers on 25/01/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import AVKit
import AVFoundation

class LoadVideo: UIViewController {
    @IBOutlet weak var label1: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
      
        NSLog("hello wold, i am viewdidload")
        print("\n\n\n\nview loaded\n\n\n\n")
        playLocalVideo()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
  
    func playLocalVideo() {
      let filePath = Bundle.main.path(forResource: "loading-2048", ofType: "mp4")
      let videoURL = NSURL(fileURLWithPath: filePath!)
      let player = AVPlayer(url: videoURL as URL)
      let playerViewController = AVPlayerViewController()
      playerViewController.player = player
      self.present(playerViewController, animated: true) {
        () -> Void in
        playerViewController.player!.play()
      }
    }
  

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
