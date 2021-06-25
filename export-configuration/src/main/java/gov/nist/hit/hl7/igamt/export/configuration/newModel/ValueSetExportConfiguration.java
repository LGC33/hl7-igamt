package gov.nist.hit.hl7.igamt.export.configuration.newModel;

import java.util.List;

import gov.nist.hit.hl7.igamt.export.configuration.domain.CodeUsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ColumnsConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.NameAndPositionAndPresence;
import gov.nist.hit.hl7.igamt.export.configuration.domain.UsageConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ValuesetMetadataConfiguration;

public class ValueSetExportConfiguration extends ResourceExportConfiguration{



	  private boolean includeValuesetsTable = true;
	  private UsageConfiguration valuesetsExport;
	  private CodeUsageConfiguration codesExport;
	  private List<NameAndPositionAndPresence> columns;
	  private ValuesetMetadataConfiguration metadataConfig;
	  private boolean unboundHL7 = false;
	  private boolean unboundCustom = false;
	  private boolean phinvadsUpdateEmailNotification;
	  private int codeNumber;
	  private int maxCodeNumber;
	  private boolean stability;
	  private boolean extensibility;
	  private boolean contentDefinition;
	  private boolean uRL;
	  private boolean vsType;
	  private boolean comments;
	  

	  public ValueSetExportConfiguration(ExportConfiguration exportConfiguration) {
	    this.includeValuesetsTable = exportConfiguration.isIncludeValuesetsTable();
	    this.valuesetsExport = exportConfiguration.getValuesetsExport();
	    this.codesExport = exportConfiguration.getCodesExport();
	    this.columns = exportConfiguration.getValuesetColumn().getColumns();
	    this.metadataConfig = exportConfiguration.getValuesetsMetadata();
	    this.unboundHL7 = exportConfiguration.isUnboundHL7();
	    this.unboundCustom = exportConfiguration.isUnboundCustom();
	    this.phinvadsUpdateEmailNotification = exportConfiguration.isPhinvadsUpdateEmailNotification();
	    this.codeNumber = exportConfiguration.getMaxCodeNumber();
	    this.maxCodeNumber = ExportConfiguration.MAX_CODE;
	    this.columns=exportConfiguration.getValuesetColumn().getColumns();
	  }

	  /**
	   * @param findExportConfigurationServiceByAuthentication
	   * @return
	   */
	  
	  
	  public ExportConfiguration populateExportConfiguration(ExportConfiguration exportConfiguration) {
	    exportConfiguration.setIncludeValuesetsTable(this.includeValuesetsTable);
	    exportConfiguration.setValuesetsExport(this.valuesetsExport);
	    exportConfiguration.setCodesExport(this.codesExport);
	    exportConfiguration.setValuesetColumn(new ColumnsConfiguration(this.columns));
	    exportConfiguration.setValuesetsMetadata(this.metadataConfig);
	    exportConfiguration.setUnboundHL7(this.unboundHL7);
	    exportConfiguration.setUnboundCustom(this.unboundCustom);
	    exportConfiguration.setPhinvadsUpdateEmailNotification(this.phinvadsUpdateEmailNotification);
	    exportConfiguration.setMaxCodeNumber(this.codeNumber);
	    return exportConfiguration;
	  }

	  public ValueSetExportConfiguration() {
		super();
		// TODO Auto-generated constructor stub
	}


	
	

	  public ValueSetExportConfiguration(boolean includeValuesetsTable, UsageConfiguration valuesetsExport,
			CodeUsageConfiguration codesExport, List<NameAndPositionAndPresence> columns,
			ValuesetMetadataConfiguration metadataConfig, boolean unboundHL7, boolean unboundCustom,
			boolean phinvadsUpdateEmailNotification, int codeNumber, int maxCodeNumber, boolean stability,
			boolean extensibility, boolean contentDefinition, boolean uRL, boolean type) {
		super();
		this.includeValuesetsTable = includeValuesetsTable;
		this.valuesetsExport = valuesetsExport;
		this.codesExport = codesExport;
		this.columns = columns;
		this.metadataConfig = metadataConfig;
		this.unboundHL7 = unboundHL7;
		this.unboundCustom = unboundCustom;
		this.phinvadsUpdateEmailNotification = phinvadsUpdateEmailNotification;
		this.codeNumber = codeNumber;
		this.maxCodeNumber = maxCodeNumber;
		this.stability = stability;
		this.extensibility = extensibility;
		this.contentDefinition = contentDefinition;
		this.uRL = uRL;
		this.vsType = type;
	}

	public boolean isStability() {
		return stability;
	}

	public void setStability(boolean stability) {
		this.stability = stability;
	}

	public boolean isExtensibility() {
		return extensibility;
	}

	public void setExtensibility(boolean extensibility) {
		this.extensibility = extensibility;
	}

	public boolean isContentDefinition() {
		return contentDefinition;
	}

	public void setContentDefinition(boolean contentDefinition) {
		this.contentDefinition = contentDefinition;
	}

	public boolean isuRL() {
		return uRL;
	}

	public void setuRL(boolean uRL) {
		this.uRL = uRL;
	}

	public boolean isType() {
		return vsType;
	}

	public void setType(boolean type) {
		this.vsType = type;
	}

	public boolean isIncludeValuesetsTable() {
	    return includeValuesetsTable;
	  }

	  public void setIncludeValuesetsTable(boolean includeValuesetsTable) {
	    this.includeValuesetsTable = includeValuesetsTable;
	  }

	  public UsageConfiguration getValuesetsExport() {
	    return valuesetsExport;
	  }

	  public void setValuesetsExport(UsageConfiguration valuesetsExport) {
	    this.valuesetsExport = valuesetsExport;
	  }

	  public CodeUsageConfiguration getCodesExport() {
	    return codesExport;
	  }

	  public void setCodesExport(CodeUsageConfiguration codesExport) {
	    this.codesExport = codesExport;
	  }

	  public List<NameAndPositionAndPresence> getColumns() {
	    return columns;
	  }

	  public void setColumns(List<NameAndPositionAndPresence> columns) {
	    this.columns = columns;
	  }

	  public ValuesetMetadataConfiguration getMetadataConfig() {
	    return metadataConfig;
	  }

	  public void setMetadataConfig(ValuesetMetadataConfiguration metadataConfig) {
	    this.metadataConfig = metadataConfig;
	  }

	  public boolean isUnboundHL7() {
	    return unboundHL7;
	  }

	  public void setUnboundHL7(boolean unboundHL7) {
	    this.unboundHL7 = unboundHL7;
	  }

	  public boolean isUnboundCustom() {
	    return unboundCustom;
	  }

	  public void setUnboundCustom(boolean unboundCustom) {
	    this.unboundCustom = unboundCustom;
	  }

	  public boolean isPhinvadsUpdateEmailNotification() {
	    return phinvadsUpdateEmailNotification;
	  }

	  public void setPhinvadsUpdateEmailNotification(boolean phinvadsUpdateEmailNotification) {
	    this.phinvadsUpdateEmailNotification = phinvadsUpdateEmailNotification;
	  }

	  public int getCodeNumber() {
	    return codeNumber;
	  }

	  public void setCodeNumber(int codeNumber) {
	    this.codeNumber = codeNumber;
	  }

	  public int getMaxCodeNumber() {
	    return maxCodeNumber;
	  }

	  public void setMaxCodeNumber(int maxCodeNumber) {
	    this.maxCodeNumber = maxCodeNumber;
	  }

	public boolean isComments() {
		return comments;
	}

	public void setComments(boolean comments) {
		this.comments = comments;
	}


}

