package gov.nist.hit.hl7.igamt.common.base.domain;

import java.io.Serializable;

public class Section implements Serializable, Comparable<Section>{
  
  private String id; 
  private String description;
  private Type type;
  private int position;
  private String label;
  
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getDescription() {
    return description;
  }
  public void setDescription(String description) {
    this.description = description;
  }
  public Type getType() {
    return type;
  }
  public void setType(Type type) {
    this.type = type;
  }
  public int getPosition() {
    return position;
  }
  public void setPosition(int position) {
    this.position = position;
  }
  public String getLabel() {
	return label;
  }
  public void setLabel(String label) {
	this.label = label;
  }
 public Section(String id, String description, Type type, int position, String label) {
	super();
	this.id = id;
	this.description = description;
	this.type = type;
	this.position = position;
	this.label = label;
 }
 public Section() {
	super();
	// TODO Auto-generated constructor stub
 }
@Override
public int compareTo(Section o) {
    return Integer.valueOf(this.getPosition()).compareTo(o.getPosition());
	
}
//public int compare(Section u1, Section u2) {
//    return Integer.valueOf(u1.getPosition()).compareTo(u2.getPosition());
//  }


}
