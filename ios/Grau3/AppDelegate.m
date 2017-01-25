/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Grau3"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  rootView.backgroundColor = [UIColor clearColor];
  
//  UIView* loadingView = [UIView new];
//  loadingView.backgroundColor = [UIColor greenColor];
//  rootView.loadingView = loadingView;
  
  UIImage *image = [UIImage imageNamed:@"loader"];
  UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"loader"]];
  imageView.frame = CGRectMake(0, 0, 100, 100);
  imageView.contentMode = UIViewContentModeBottom;
  imageView.image = image;
  rootView.loadingView = imageView;
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
