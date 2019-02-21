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
package gov.nist.hit.hl7.igamt.common.binding.domain;

import java.util.HashSet;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;


/**
 * @author jungyubw
 *
 */
public class StructureElementBinding extends Binding {

  private Set<Comment> comments;
  private Set<ValuesetBinding> valuesetBindings;
  private InternalSingleCode internalSingleCode;
  private ExternalSingleCode externalSingleCode;
  private String constantValue;
  private String predicateId;

  public StructureElementBinding() {
    super();
  }

  public Set<Comment> getComments() {
    return comments;
  }

  public void setComments(Set<Comment> comments) {
    this.comments = comments;
  }

  public Set<ValuesetBinding> getValuesetBindings() {
    return valuesetBindings;
  }

  public void setValuesetBindings(Set<ValuesetBinding> valuesetBindings) {
    this.valuesetBindings = valuesetBindings;
  }

  public void addComment(Comment newComment) {
    if (this.comments == null)
      this.comments = new HashSet<Comment>();
    this.comments.add(newComment);
  }

  public String getConstantValue() {
    return constantValue;
  }

  public void setConstantValue(String constantValue) {
    this.constantValue = constantValue;
  }

  public void addValuesetBinding(ValuesetBinding newValuesetBinding) {
    if (this.valuesetBindings == null)
      this.valuesetBindings = new HashSet<ValuesetBinding>();
    this.valuesetBindings.add(newValuesetBinding);
  }

  public ExternalSingleCode getExternalSingleCode() {
    return externalSingleCode;
  }

  public void setExternalSingleCode(ExternalSingleCode externalSingleCode) {
    this.externalSingleCode = externalSingleCode;
  }

  public InternalSingleCode getInternalSingleCode() {
    return internalSingleCode;
  }

  public void setInternalSingleCode(InternalSingleCode internalSingleCode) {
    this.internalSingleCode = internalSingleCode;
  }

  public String getPredicateId() {
    return predicateId;
  }

  public void setPredicateId(String predicateId) {
    this.predicateId = predicateId;
  }
}
