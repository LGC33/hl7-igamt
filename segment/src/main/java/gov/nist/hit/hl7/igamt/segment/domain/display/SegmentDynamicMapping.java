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

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.segment.domain.DynamicMappingInfo;

/**
 * @author jungyubw
 *
 */
public class SegmentDynamicMapping {
  private String id;
  private String name;
  private Date updateDate;
  private String label;
  private Scope scope;
  private String version;
  private DynamicMappingInfo dynamicMappingInfo;
  private Set<CodeInfo> referenceCodes;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Date getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(Date updateDate) {
    this.updateDate = updateDate;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String label) {
    this.label = label;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public DynamicMappingInfo getDynamicMappingInfo() {
    return dynamicMappingInfo;
  }

  public void setDynamicMappingInfo(DynamicMappingInfo dynamicMappingInfo) {
    this.dynamicMappingInfo = dynamicMappingInfo;
  }

  public Set<CodeInfo> getReferenceCodes() {
    return referenceCodes;
  }

  public void setReferenceCodes(Set<CodeInfo> referenceCodes) {
    this.referenceCodes = referenceCodes;
  }
  
  public void addReferenceCode(CodeInfo codeInfo){
    if(this.referenceCodes == null) this.referenceCodes = new HashSet<CodeInfo>();
    this.referenceCodes.add(codeInfo);
  }


}
