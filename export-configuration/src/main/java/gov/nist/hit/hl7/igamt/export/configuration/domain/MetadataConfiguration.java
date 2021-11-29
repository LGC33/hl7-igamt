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
package gov.nist.hit.hl7.igamt.export.configuration.domain;

/**
 *
 * @author Maxence Lefort on Mar 13, 2018.
 */
public class MetadataConfiguration {

  private boolean hl7version = true;
  private boolean publicationDate = true;
  private boolean publicationVersion = true;
  private boolean scope = true;
  private boolean preDefinition = true;
  private boolean postDefinition = true;
  private boolean usageNotes = true;
  private boolean AuthorNotes = true;
  
  //for conformance profiles
  private boolean organization = true;
  private boolean author = true;
  private boolean type = false;
  private boolean role = false;
  
  //for DatatypeLibrary
  private boolean datatypeName = true;
  private boolean datatypeFlavor = true;
  private boolean shortDescription = true;
  private boolean status = true;
  
  


  public MetadataConfiguration() {
    super();
  }

  public MetadataConfiguration(boolean hl7version, boolean publicationDate,
      boolean publicationVersion, boolean scope) {
    super();
    this.hl7version = hl7version;
    this.publicationDate = publicationDate;
    this.publicationVersion = publicationVersion;
    this.scope = scope;
    
  }
  
  
  
  public boolean isDatatypeName() {
	return datatypeName;
}

public void setDatatypeName(boolean datatypeName) {
	this.datatypeName = datatypeName;
}

public boolean isDatatypeFlavor() {
	return datatypeFlavor;
}

public void setDatatypeFlavor(boolean datatypeFlavor) {
	this.datatypeFlavor = datatypeFlavor;
}

public boolean isShortDescription() {
	return shortDescription;
}

public void setShortDescription(boolean shortDescription) {
	this.shortDescription = shortDescription;
}

public boolean isStatus() {
	return status;
}

public void setStatus(boolean status) {
	this.status = status;
}

public boolean isOrganization() {
	return organization;
}

public void setOrganization(boolean organization) {
	this.organization = organization;
}

public boolean isAuthor() {
	return author;
}

public void setAuthor(boolean author) {
	this.author = author;
}

public boolean isType() {
	return type;
}

public void setType(boolean type) {
	this.type = type;
}

public boolean isRole() {
	return role;
}

public void setRole(boolean role) {
	this.role = role;
}

public boolean isPreDefinition() {
	return preDefinition;
}

public void setPreDefinition(boolean preDefinition) {
	this.preDefinition = preDefinition;
}

public boolean isPostDefinition() {
	return postDefinition;
}

public void setPostDefinition(boolean postDefinition) {
	this.postDefinition = postDefinition;
}

public boolean isUsageNotes() {
	return usageNotes;
}

public void setUsageNotes(boolean usageNotes) {
	this.usageNotes = usageNotes;
}

public boolean isAuthorNotes() {
	return AuthorNotes;
}

public void setAuthorNotes(boolean authorNotes) {
	AuthorNotes = authorNotes;
}

public boolean isHl7version() {
    return hl7version;
  }

  public void setHl7version(boolean hl7version) {
    this.hl7version = hl7version;
  }

  public boolean isPublicationDate() {
    return publicationDate;
  }

  public void setPublicationDate(boolean publicationDate) {
    this.publicationDate = publicationDate;
  }

  public boolean isPublicationVersion() {
    return publicationVersion;
  }

  public void setPublicationVersion(boolean publicationVersion) {
    this.publicationVersion = publicationVersion;
  }

  public boolean isScope() {
    return scope;
  }

  public void setScope(boolean scope) {
    this.scope = scope;
  }
  
}
