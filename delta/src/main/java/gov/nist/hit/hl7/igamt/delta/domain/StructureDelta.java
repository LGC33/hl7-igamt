package gov.nist.hit.hl7.igamt.delta.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import gov.nist.diff.domain.DeltaAction;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.constraints.domain.Predicate;
import gov.nist.hit.hl7.igamt.valueset.domain.CodeUsage;

import java.util.List;

public class StructureDelta {

    private StructureDeltaData data;
    private List<StructureDelta> children;

    public StructureDelta() {
        this.data = new StructureDeltaData();
    }

    @JsonIgnore
    public DeltaAction getAction() {
        return data.getAction();
    }

    public void setAction(DeltaAction action) {
        data.setAction(action);
    }

    @JsonIgnore
    public Integer getPosition() {
        return data.getPosition();
    }

    public void setPosition(Integer position) {
        data.setPosition(position);
    }

    @JsonIgnore
    public Type getType() {
        return data.getType();
    }

    public void setType(Type type) {
        data.setType(type);
    }

    @JsonIgnore
    public DeltaNode<Usage> getUsage() {
        return data.getUsage();
    }

    public void setUsage(DeltaNode<Usage> usage) {
        data.setUsage(usage);
    }

    @JsonIgnore
    public DeltaNode<CodeUsage> getCodeUsage() {
        return data.getCodeUsage();
    }

    public void setCodeUsage(DeltaNode<CodeUsage> codeUsage) {
        data.setCodeUsage(codeUsage);
    }

    @JsonIgnore
    public DeltaNode<String> getConstantValue() {
        return data.getConstantValue();
    }

    public void setConstantValue(DeltaNode<String> constantValue) {
        data.setConstantValue(constantValue);
    }

    @JsonIgnore
    public DeltaNode<String> getMinLength() {
        return data.getMinLength();
    }

    public void setMinLength(DeltaNode<String> minLength) {
        data.setMinLength(minLength);
    }

    @JsonIgnore
    public DeltaNode<String> getMaxLength() {
        return data.getMaxLength();
    }

    public void setMaxLength(DeltaNode<String> maxLength) {
        data.setMaxLength(maxLength);
    }

    @JsonIgnore
    public DeltaNode<Integer> getMinCardinality() {
        return data.getMinCardinality();
    }

    public void setMinCardinality(DeltaNode<Integer> minCardinality) {
        data.setMinCardinality(minCardinality);
    }

    @JsonIgnore
    public DeltaNode<String> getMaxCardinality() {
        return data.getMaxCardinality();
    }

    public void setMaxCardinality(DeltaNode<String> maxCardinality) {
        data.setMaxCardinality(maxCardinality);
    }

    @JsonIgnore
    public DeltaNode<String> getConfLength() {
        return data.getConfLength();
    }

    public void setConfLength(DeltaNode<String> confLength) {
        data.setConfLength(confLength);
    }

    @JsonIgnore
    public DeltaNode<String> getDefinition() {
        return data.getDefinition();
    }

    public void setDefinition(DeltaNode<String> definition) {
        data.setDefinition(definition);
    }

    @JsonIgnore
    public ReferenceDelta getReference() {
        return data.getReference();
    }

    public void setReference(ReferenceDelta reference) {
        data.setReference(reference);
    }

    @JsonIgnore
    public DeltaNode<String> getName() {
        return data.getName();
    }

    public void setName(DeltaNode<String> name) {
        data.setName(name);
    }

    @JsonIgnore
    public DeltaValuesetBinding getValueSetBinding() {
        return data.getValuesetBinding();
    }

    public void setValueSetBinding(DeltaValuesetBinding valueSetBinding) {
        data.setValuesetBinding(valueSetBinding);
    }

    @JsonIgnore
    public DeltaInternalSingleCode getInternalSingleCode() {
        return data.getInternalSingleCode();
    }

    public void setPredicate(PredicateDelta predicate) {
        data.setPredicate(predicate);
    }

    @JsonIgnore
    public PredicateDelta getPredicate() {
        return data.getPredicate();
    }

    public void setInternalSingleCode(DeltaInternalSingleCode deltaInternalSingleCode) {
        data.setInternalSingleCode(deltaInternalSingleCode);
    }

    @JsonIgnore
    public ConformanceStatementDelta getConformanceStatement() {
        return data.getConformanceStatement();
    }

    public void setConformanceStatement(ConformanceStatementDelta conformanceStatement) {
        data.setConformanceStatement(conformanceStatement);
    }

    public StructureDeltaData getData() {
        return data;
    }

    public void setData(StructureDeltaData data) {
        this.data = data;
    }

    public List<StructureDelta> getChildren() {
        return children;
    }

    public void setChildren(List<StructureDelta> children) {
        this.children = children;
        boolean hasChange = children
                .stream()
                .anyMatch((child) -> !child.getAction().equals(DeltaAction.UNCHANGED));
        if(hasChange) {
            this.setAction(DeltaAction.UPDATED);
        }
    }
}
