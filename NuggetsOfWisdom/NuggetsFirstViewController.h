//
//  NuggetsFirstViewController.h
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/8/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "Nugget.h"

@interface NuggetsFirstViewController : UIViewController <UITextViewDelegate>

@property (weak, nonatomic) IBOutlet UITextView *nuggetText;
@property (weak, nonatomic) IBOutlet UITextField *NuggetToAddSource;
@property (weak, nonatomic) IBOutlet UITextField *NuggetToAddTags;
@property (weak, nonatomic) IBOutlet UILabel *nuggetCharacterCounter;

- (Nugget *)createNugget:(NSString *)text withSource:(NSString *)source withTags:(NSString *)tags;

@end
