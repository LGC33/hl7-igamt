/**
 * 
 */
package gov.nist.hit.hl7.igamt.profilecomponent.domain.compositeprofile;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.ProfileComponent;

/**
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * <p>
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public class OrderedProfileComponent {

  private int position;
  private ProfileComponent profileComponent;

  public OrderedProfileComponent(int position, ProfileComponent profileComponent) {
    super();
    this.position = position;
    this.profileComponent = profileComponent;
  }

  public int getPosition() {
    return position;
  }

  public void setPosition(int position) {
    this.position = position;
  }

  public ProfileComponent getProfileComponent() {
    return profileComponent;
  }

  public void setProfileComponent(ProfileComponent profileComponent) {
    this.profileComponent = profileComponent;
  }

}