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
package gov.nist.hit.hl7.igamt.segment.domain.display;

import java.util.HashSet;
import java.util.Set;
import gov.nist.diff.annotation.DeltaField;
import gov.nist.diff.annotation.DeltaIdentity;
import gov.nist.hit.hl7.igamt.datatype.domain.display.ComponentStructureTreeModel;

/**
 * @author jungyubw
 *
 */
public class FieldStructureTreeModel {
  @DeltaIdentity
  private FieldDisplayDataModel data;
  @DeltaField
  private Set<ComponentStructureTreeModel> children;

  public FieldDisplayDataModel getData() {
    return data;
  }

  public void setData(FieldDisplayDataModel data) {
    this.data = data;
  }

  public Set<ComponentStructureTreeModel> getChildren() {
    return children;
  }

  public void setChildren(Set<ComponentStructureTreeModel> children) {
    this.children = children;
  }

  /**
   * @param componentStructureTreeModel
   */
  public void addComponent(ComponentStructureTreeModel componentStructureTreeModel) {
    if (children == null)
      this.children = new HashSet<ComponentStructureTreeModel>();
    this.children.add(componentStructureTreeModel);
  }

}
