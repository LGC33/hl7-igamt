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
 */
package gov.nist.hit.hl7.igamt.profilecomponent.domain;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.profilecomponent.domain.property.ItemProperty;

/**
 * A profile component item is a set of changes for a specific item (a datatype, a component, a
 * message...).
 * 
 * Created by Maxence Lefort on Feb 20, 2018.
 */
public class ProfileComponentItem {

  private String path;
  private Set<ItemProperty> itemProperties;

  public ProfileComponentItem() {
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public Set<ItemProperty> getDeltaObjects() {
    return itemProperties;
  }

  public void setDeltaObjects(Set<ItemProperty> itemProperties) {
    this.itemProperties = itemProperties;
  }
  
  public void addItemProperty(ItemProperty itemProperty) {
    if(itemProperties == null) this.itemProperties = new HashSet<ItemProperty>();
    this.itemProperties.add(itemProperty);
  }

}

