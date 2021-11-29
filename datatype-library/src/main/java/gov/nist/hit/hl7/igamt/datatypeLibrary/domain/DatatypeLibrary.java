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
package gov.nist.hit.hl7.igamt.datatypeLibrary.domain;

import java.util.HashSet;
import java.util.Set;

import org.springframework.data.mongodb.core.mapping.Document;

import gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentMetadata;
import gov.nist.hit.hl7.igamt.common.base.domain.DocumentStructure;
import gov.nist.hit.hl7.igamt.common.base.domain.DomainInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.PublicationInfo;
import gov.nist.hit.hl7.igamt.common.base.domain.TextSection;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.domain.registry.DatatypeRegistry;
import gov.nist.hit.hl7.igamt.export.configuration.newModel.DocumentExportConfiguration;
import gov.nist.hit.hl7.igamt.valueset.domain.registry.ValueSetRegistry;


/**
 * @author ena3
 *
 */
@Document
public class DatatypeLibrary extends DocumentStructure {

  /**
   * 
   */
  private static final long serialVersionUID = 1L;

  private DatatypeRegistry datatypeRegistry = new DatatypeRegistry();
  private ValueSetRegistry valueSetRegistry = new ValueSetRegistry();
//  private DocumentExportConfiguration lastUserConfiguration;


  /**
   * 
   */
  public DatatypeLibrary() {
    super();
    this.setType(Type.DATATYPELIBRARY);
    // TODO Auto-generated constructor stub
  }


//
//  public DocumentExportConfiguration getLastUserConfiguration() {
//    return lastUserConfiguration;
//  }



//  public void setLastUserConfiguration(DocumentExportConfiguration lastUserConfiguration) {
//    this.lastUserConfiguration = lastUserConfiguration;
//  }



  public static long getSerialversionuid() {
    return serialVersionUID;
  }



  public DatatypeRegistry getDatatypeRegistry() {
    return datatypeRegistry;
  }

  public void setDatatypeRegistry(DatatypeRegistry datatypeRegistry) {
    this.datatypeRegistry = datatypeRegistry;
  }

  /*
   * (non-Javadoc)
   * 
   * @see gov.nist.hit.hl7.igamt.common.base.domain.AbstractDomain#getLabel()
   */
  @Override
  public String getLabel() {
    // TODO Auto-generated method stub
    return null;
  }

  public ValueSetRegistry getValueSetRegistry() {
    return valueSetRegistry;
  }

  public void setValueSetRegistry(ValueSetRegistry valueSetRegistry) {
    this.valueSetRegistry = valueSetRegistry;
  }



  /**
   * @param dt
   * @param id
   * @return
   */
  public static boolean isLibFlavor(Datatype dt, String id) {
    // TODO Auto-generated method stub
    if(dt.getParentId() == null) {
      return false;
    }else {
      if(dt.getParentId().equals(id)) {
        return true;
      }else if(dt.getLibraryReferences() !=null){
        return dt.getLibraryReferences().contains(id);  
      }
    }
    return false;
    
  }
}
