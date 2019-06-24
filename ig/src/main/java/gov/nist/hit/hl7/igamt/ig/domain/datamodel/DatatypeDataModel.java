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
package gov.nist.hit.hl7.igamt.ig.domain.datamodel;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.ExternalSingleCode;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.constraints.domain.ConformanceStatement;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.constraints.repository.ConformanceStatementRepository;
import gov.nist.hit.hl7.igamt.constraints.repository.PredicateRepository;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;

/**
 * @author jungyubw
 *
 */
public class DatatypeDataModel {
  private Datatype model;

  private Set<ConformanceStatement> conformanceStatements = new HashSet<ConformanceStatement>();
  private Map<String, Predicate> predicateMap = new HashMap<String, Predicate>();
  private Map<String, ExternalSingleCode> singleCodeMap = new HashMap<String, ExternalSingleCode>();
  private Map<String, Set<ValuesetBindingDataModel>> valuesetMap = new HashMap<String, Set<ValuesetBindingDataModel>>();
  private Set<ComponentDataModel> componentDataModels = new HashSet<ComponentDataModel>();

  public Datatype getModel() {
    return model;
  }

  public void setModel(Datatype model) {
    this.model = model;
  }

  public Map<String, Predicate> getPredicateMap() {
    return predicateMap;
  }

  public void setPredicateMap(Map<String, Predicate> predicateMap) {
    this.predicateMap = predicateMap;
  }

  public Map<String, ExternalSingleCode> getSingleCodeMap() {
    return singleCodeMap;
  }

  public void setSingleCodeMap(Map<String, ExternalSingleCode> singleCodeMap) {
    this.singleCodeMap = singleCodeMap;
  }

  public Map<String, Set<ValuesetBindingDataModel>> getValuesetMap() {
    return valuesetMap;
  }

  public void setValuesetMap(Map<String, Set<ValuesetBindingDataModel>> valuesetMap) {
    this.valuesetMap = valuesetMap;
  }
  
  /**
   * @param d
   * @param valuesetBindingDataModelMap
   * @param conformanceStatementRepository
   * @param predicateRepository
   */
  public void putModel(Datatype d, DatatypeService dataytpeService, Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap, ConformanceStatementRepository conformanceStatementRepository, PredicateRepository predicateRepository) {
    this.model = d;
    
    if (d.getBinding() != null){
      if(d.getBinding().getConformanceStatementIds() != null){
        for(String csId: d.getBinding().getConformanceStatementIds()){
          conformanceStatementRepository.findById(csId).ifPresent(cs -> this.conformanceStatements.add(cs));
        }
      }
    }
    
    if ( d.getBinding() !=null && d.getBinding().getChildren() != null) {
     this.popPathBinding(d.getBinding().getChildren(), null, predicateRepository, valuesetBindingDataModelMap);
    }
    
    if (d instanceof ComplexDatatype) {
      ComplexDatatype cd = (ComplexDatatype)d;
     
      if(cd.getComponents() != null) {
        cd.getComponents().forEach(c -> {
          String key = c.getPosition() + "";
          if(c.getRef() != null && c.getRef().getId() != null){
            Datatype childDt = dataytpeService.findById(c.getRef().getId());
            if(childDt != null) {
              this.componentDataModels.add(new ComponentDataModel(
                  c, 
                  this.predicateMap.get(key), 
                  this.singleCodeMap.get(key),
                  this.valuesetMap.get(key),
                  new DatatypeBindingDataModel(childDt)
                  ));    
            }
          }
        });
      }
    }
  }

  /**
   * @param children
   * @param object
   */
  private void popPathBinding(Set<StructureElementBinding> sebs, String path, PredicateRepository predicateRepository,  Map<String, ValuesetBindingDataModel> valuesetBindingDataModelMap) {
    for (StructureElementBinding seb : sebs) {
      String key;
      if(path == null){
        key = seb.getLocationInfo().getPosition() + "";
      }else {
        key = path + "." + seb.getLocationInfo().getPosition();
      }
      
      if(seb.getPredicateId() != null){
        predicateRepository.findById(seb.getPredicateId()).ifPresent(cp -> this.predicateMap.put(key, cp));
      }
      
      if(seb.getExternalSingleCode() != null){
        this.singleCodeMap.put(key, seb.getExternalSingleCode());
      }
      
      if(seb.getValuesetBindings() != null && seb.getValuesetBindings().size() > 0){
        Set<ValuesetBindingDataModel> vbdm = new HashSet<ValuesetBindingDataModel>();
        for(ValuesetBinding vb : seb.getValuesetBindings()) {
          ValuesetBindingDataModel valuesetBindingDataModel = valuesetBindingDataModelMap.get(vb.getValuesetId());
          if(valuesetBindingDataModel != null) {
            valuesetBindingDataModel.setValuesetBinding(vb);
            vbdm.add(valuesetBindingDataModel);
          }
        }
        
        if(vbdm != null && vbdm.size() > 0) {
          this.valuesetMap.put(key, vbdm);          
        }
      }
      
      if (seb.getChildren() != null) {
       //this.popPathBinding(seb.getChildren(), key, predicateRepository, valuesetBindingDataModelMap);
      }
    }
  }

  public Set<ConformanceStatement> getConformanceStatements() {
    return conformanceStatements;
  }

  public void setConformanceStatements(Set<ConformanceStatement> conformanceStatemens) {
    this.conformanceStatements = conformanceStatemens;
  }

  public Set<ComponentDataModel> getComponentDataModels() {
    return componentDataModels;
  }

  public void setComponentDataModels(Set<ComponentDataModel> componentDataModels) {
    this.componentDataModels = componentDataModels;
  }
}
