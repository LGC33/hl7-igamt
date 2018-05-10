/**
 * 
 * This software was developed at the National Institute of Standards and Technology by employees of
 * the Federal Government in the course of their official duties. Pursuant to title 17 Section 105
 * of the United States Code this software is not subject to copyright protection and is in the
 * public domain. This is an experimental system. NIST assumes no responsibility whatsoever for its
 * use by other parties, and makes no guarantees, expressed or implied, about its quality,
 * reliability, or any other characteristic. We would appreciate acknowledgement if the software is
 * used. This software can be redistributed and/or modified freely provided that any derivative
 * works bear some notice that they are derived from it, and any modified versions bear some notice
 * that they have been modified.
 * 
 */
package gov.nist.hit.hl7.igamt.valueset.service;

import java.util.List;

import gov.nist.hit.hl7.igamt.shared.domain.CompositeKey;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeSystem;

/**
 *
 * @author Jungyub Woo on Mar 1, 2018.
 */
public interface CodeSystemService {

  public CodeSystem findById(CompositeKey id);

  public CodeSystem findLatestById(String id);

  public CodeSystem create(CodeSystem codeSystem);

  public CodeSystem save(CodeSystem codeSystem);

  public List<CodeSystem> findAll();

  public void delete(CodeSystem codeSystem);

  public void delete(CompositeKey id);

  public void removeCollection();

  List<CodeSystem> findByDomainInfoScopeAndDomainInfoVersionAndIdentifier( String scope, String hl7version,String identifier);

}
