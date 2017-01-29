import UIKit
import AVKit
import AVFoundation

class LoadVideo: AVPlayerViewController {
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    print("view did load!!!!!")
    
    playLocalVideo()
  }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }
  
  func playLocalVideo() {
    let filePath = Bundle.main.path(forResource: "loading 2048", ofType: "mp4")
    let videoURL = NSURL(fileURLWithPath: filePath!)
    let player = AVPlayer(url: videoURL as URL)
    //        let playerViewController = AVPlayerViewController()
    self.showsPlaybackControls = false
    
    self.player = player
    
    self.player!.play()
  }
    
}
