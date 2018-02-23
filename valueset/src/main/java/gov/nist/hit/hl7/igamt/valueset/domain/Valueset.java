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
package gov.nist.hit.hl7.igamt.valueset.domain;

import java.net.URL;
import java.util.Set;

import gov.nist.hit.hl7.igamt.shared.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.shared.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.shared.domain.Resource;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ContentDefinition;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Extensibility;
import gov.nist.hit.hl7.igamt.valueset.domain.property.ManagedBy;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Stability;

/**
 * @author jungyubw
 *
 */
public class Valueset extends Resource {
  private String bindingIdentifier;
  private String oid;
  private String intensionalComment;
  private URL url;

  private ManagedBy managedBy = ManagedBy.Internal;
  private Stability stability = Stability.Undefined;
  private Extensibility extensibility = Extensibility.Undefined;
  private ContentDefinition contentDefinition = ContentDefinition.Undefined;

  protected int numberOfCodes;
  private Set<String> codeSystemIds;
  private Set<CodeRef> codeRefs;
  private Set<Code> codes;

  public Valueset(String id, String version, String name, PublicationInfo publicationInfo,
      DomainInfo domainInfo, String username, String comment, String description, String preDef,
      String postDef, String bindingIdentifier, String oid, String intensionalComment, URL url,
      ManagedBy managedBy, Stability stability, Extensibility extensibility,
      ContentDefinition contentDefinition, int numberOfCodes, Set<String> codeSystemIds,
      Set<CodeRef> codeRefs, Set<Code> codes) {
    super(id, version, name, publicationInfo, domainInfo, username, comment, description, preDef,
        postDef);
    this.bindingIdentifier = bindingIdentifier;
    this.oid = oid;
    this.intensionalComment = intensionalComment;
    this.url = url;
    this.managedBy = managedBy;
    this.stability = stability;
    this.extensibility = extensibility;
    this.contentDefinition = contentDefinition;
    this.numberOfCodes = numberOfCodes;
    this.codeSystemIds = codeSystemIds;
    this.codeRefs = codeRefs;
    this.codes = codes;
  }

  public String getBindingIdentifier() {
    return bindingIdentifier;
  }

  public void setBindingIdentifier(String bindingIdentifier) {
    this.bindingIdentifier = bindingIdentifier;
  }

  public String getOid() {
    return oid;
  }

  public void setOid(String oid) {
    this.oid = oid;
  }

  public String getIntensionalComment() {
    return intensionalComment;
  }

  public void setIntensionalComment(String intensionalComment) {
    this.intensionalComment = intensionalComment;
  }

  public URL getUrl() {
    return url;
  }

  public void setUrl(URL url) {
    this.url = url;
  }

  public ManagedBy getManagedBy() {
    return managedBy;
  }

  public void setManagedBy(ManagedBy managedBy) {
    this.managedBy = managedBy;
  }

  public Stability getStability() {
    return stability;
  }

  public void setStability(Stability stability) {
    this.stability = stability;
  }

  public Extensibility getExtensibility() {
    return extensibility;
  }

  public void setExtensibility(Extensibility extensibility) {
    this.extensibility = extensibility;
  }

  public ContentDefinition getContentDefinition() {
    return contentDefinition;
  }

  public void setContentDefinition(ContentDefinition contentDefinition) {
    this.contentDefinition = contentDefinition;
  }

  public int getNumberOfCodes() {
    return this.codes.size() + this.codeRefs.size();
  }

  public void setNumberOfCodes(int numberOfCodes) {
    this.numberOfCodes = numberOfCodes;
  }

  public void updateNumberOfCodes() {
    this.numberOfCodes = this.codes.size() + this.codeRefs.size();
  }

  public Set<String> getCodeSystemIds() {
    return codeSystemIds;
  }

  public void setCodeSystemIds(Set<String> codeSystemIds) {
    this.codeSystemIds = codeSystemIds;
  }

  public Set<CodeRef> getCodeRefs() {
    return codeRefs;
  }

  public void setCodeRefs(Set<CodeRef> codeRefs) {
    this.codeRefs = codeRefs;
    this.updateNumberOfCodes();
  }

  public Set<Code> getCodes() {
    return codes;
  }

  public void setCodes(Set<Code> codes) {
    this.codes = codes;
    this.updateNumberOfCodes();
  }


}
