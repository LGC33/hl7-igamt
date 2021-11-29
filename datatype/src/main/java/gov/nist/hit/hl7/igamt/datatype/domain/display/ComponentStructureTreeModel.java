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
package gov.nist.hit.hl7.igamt.datatype.domain.display;

import java.util.HashSet;
import java.util.Set;
import gov.nist.diff.annotation.DeltaField;
import gov.nist.diff.annotation.DeltaIdentity;

/**
 * @author jungyubw
 *
 */
public class ComponentStructureTreeModel {
  @DeltaIdentity
  private ComponentDisplayDataModel data;
  @DeltaField
  private Set<SubComponentStructureTreeModel> children;

  public ComponentDisplayDataModel getData() {
    return data;
  }

  public void setData(ComponentDisplayDataModel data) {
    this.data = data;
  }

  public Set<SubComponentStructureTreeModel> getChildren() {
    return children;
  }

  public void setChildren(Set<SubComponentStructureTreeModel> children) {
    this.children = children;
  }

  public void addSubComponent(SubComponentStructureTreeModel subComponentStructureTreeModel) {
    if (children == null)
      this.children = new HashSet<SubComponentStructureTreeModel>();
    this.children.add(subComponentStructureTreeModel);
  }

}
