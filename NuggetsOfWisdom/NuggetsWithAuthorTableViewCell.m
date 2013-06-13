//
//  NuggetsWithAuthorTableViewCell.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/9/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsWithAuthorTableViewCell.h"

@implementation NuggetsWithAuthorTableViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        // Initialization code
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated
{
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

- (void)awakeFromNib
{
    
    UIColor* mainColor = [UIColor colorWithRed:28.0/255 green:158.0/255 blue:121.0/255 alpha:1.0f];
    UIColor* neutralColor = [UIColor colorWithWhite:0.4 alpha:1.0];
    
    NSString* fontName = @"Avenir-Book";
    NSString* boldItalicFontName = @"Avenir-BlackOblique";
    NSString* boldFontName = @"Avenir-Black";
    
//    self.authorPic.clipsToBounds = YES;
//    self.authorPic.layer.cornerRadius = 20.0f;
//    self.authorPic.layer.borderWidth = 2.0f;
//    self.authorPic.layer.borderColor = mainColorLight.CGColor;
//    self.authorPic.contentMode = UIViewContentModeScaleAspectFill;
//    self.authorPic.clipsToBounds = YES;
//    self.authorPic.layer.cornerRadius = 2.0f;
//    
//    self.authorPic.backgroundColor = [UIColor whiteColor];
//    self.authorPic.layer.borderColor = [UIColor colorWithWhite:0.8f alpha:0.6f].CGColor;
//    self.authorPic.layer.borderWidth = 1.0f;
//    self.authorPic.layer.cornerRadius = 2.0f;
    
    self.authorName.textColor =  mainColor;
    self.authorName.font =  [UIFont fontWithName:boldFontName size:14.0f];
    
    self.nuggetLabel.textColor =  neutralColor;
    self.nuggetLabel.font =  [UIFont fontWithName:fontName size:14.0f];
    
    self.nuggetTagsLabel.textColor = mainColor;
    self.nuggetTagsLabel.font =  [UIFont fontWithName:boldItalicFontName size:12.0f];
    
    self.nuggetSourceLabel.textColor =  mainColor;
    self.nuggetSourceLabel.font =  [UIFont fontWithName:boldFontName size:14.0f];
    
    self.selectionStyle = UITableViewCellSelectionStyleNone;
}

@end
