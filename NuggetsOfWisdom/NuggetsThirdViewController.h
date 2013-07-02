//
//  NuggetsThirdViewController.h
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NuggetsThirdViewController : UITableViewController <UIAlertViewDelegate>

@property (nonatomic, strong) NSMutableArray *nuggets;
@property (weak, nonatomic) IBOutlet UINavigationItem *navigationBar;

@end
