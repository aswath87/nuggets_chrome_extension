//
//  NuggetsFourthViewController.m
//  NuggetsOfWisdom
//
//  Created by Nathan Chan on 6/9/13.
//  Copyright (c) 2013 Nathan Chan. All rights reserved.
//

#import "NuggetsFourthViewController.h"
#import "NuggetsWithAuthorTableViewCell.h"
#import "NuggetViewController.h"
#import <Parse/Parse.h>

@interface NuggetsFourthViewController ()

@end

@implementation NuggetsFourthViewController

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [self loadNuggets];
    [self.refreshControl addTarget:self
                            action:@selector(loadPlaces)
                  forControlEvents:UIControlEventValueChanged];
}

- (void)loadNuggets
{
    //    [self.refreshControl beginRefreshing];
    dispatch_queue_t loaderQ = dispatch_queue_create("loader", NULL);
    dispatch_async(loaderQ, ^{
        PFQuery *query = [PFQuery queryWithClassName:@"Nugget"];
        [query whereKey:@"owner" notEqualTo:[PFUser currentUser]];
        [query includeKey:@"owner"];
        NSArray *nuggets = [query findObjects];
        dispatch_async(dispatch_get_main_queue(), ^{
            self.nuggets = nuggets;
            [self.tableView reloadData];
            //            [self.refreshControl endRefreshing];
        });
    });
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSString *)nuggetForRow:(NSUInteger)row
{
    return self.nuggets[row][@"text"];
}

- (NSString *)nuggetSourceForRow:(NSUInteger)row
{
    return self.nuggets[row][@"source"];
}

- (NSString *)nuggetTagForRow:(NSUInteger)row
{
    return [self.nuggets[row][@"tags"] componentsJoinedByString:@", "];
}

- (NSString *)nuggetOwnerNameForRow:(NSUInteger)row
{
    PFUser *owner = self.nuggets[row][@"owner"];
    return [owner objectForKey:@"displayname"];
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.nuggets count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"NuggetWithAuthorCell";
    NuggetsWithAuthorTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"NuggetWithAuthorCell" owner:self options:nil];
        cell = [nib objectAtIndex:0];
    }
    
    cell.authorPic.image = [UIImage imageNamed:@"unknown_user.png"];
    cell.authorName.text = [self nuggetOwnerNameForRow:indexPath.row];
    cell.nuggetSourceLabel.text = [self nuggetSourceForRow:indexPath.row];
    cell.nuggetLabel.text = [self nuggetForRow:indexPath.row];
    cell.nuggetTagsLabel.text = [self nuggetTagForRow:indexPath.row];
    
    return cell;
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    NSIndexPath *indexPath = [self.tableView indexPathForCell:sender];
    if ([[segue identifier] isEqualToString:@"toNuggetPage2"]) {
        // Set the selected button in the new view
        [segue.destinationViewController setTitle:[self nuggetOwnerNameForRow:indexPath.row]];
        [segue.destinationViewController setNugget:[self nuggetForRow:indexPath.row]];
        [segue.destinationViewController setNuggetSource:[self nuggetSourceForRow:indexPath.row]];
        [segue.destinationViewController setNuggetTags:[self nuggetTagForRow:indexPath.row]];
    }
}

/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
{
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

#pragma mark - Table view delegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Navigation logic may go here. Create and push another view controller.
    /*
     <#DetailViewController#> *detailViewController = [[<#DetailViewController#> alloc] initWithNibName:@"<#Nib name#>" bundle:nil];
     // ...
     // Pass the selected object to the new view controller.
     [self.navigationController pushViewController:detailViewController animated:YES];
     */
}

@end
