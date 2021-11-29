//package gov.nist.hit.hl7.igamt.web.export.service.impl;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.Comparator;
//import java.util.HashMap;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//
//import org.springframework.beans.factory.annotation.Autowired;
//
//import gov.nist.hit.hl7.igamt.common.base.domain.Ref;
//import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
//import gov.nist.hit.hl7.igamt.datatype.domain.Component;
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import gov.nist.hit.hl7.igamt.datatype.serialization.SerializableDatatype;
//import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
//import gov.nist.hit.hl7.igamt.serialization.exception.ResourceSerializationException;
//import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;
//import gov.nist.hit.hl7.igamt.web.export.service.DatatypeLibraryPopulateObjectService;
//
//@org.springframework.stereotype.Component
//public class DatatypeLibraryPopulateObjectServiceImpl implements DatatypeLibraryPopulateObjectService {
//
//	@Autowired
//	  private DatatypeService datatypeService;
//	
//	@Autowired
//	  private MyExportObject myExportObject;
//	
//	@Override
//	public MyExportObject populateExportObject(Map<String, Datatype> datatypesMap) {
//		String allDatatypesXml ;
//		Map<String,String> datatypeNamesMap = new HashMap<>();
//		Map<String,String> datatypesXMLOneByOne = new HashMap<>();
//		Map<String,String> datatypesXMLbyRoot = new HashMap<>();
//		Map<Datatype,String> mapDatatypeToXML = new HashMap<>();
//		Map<String,List<Datatype>> datatypesbyRoot = new HashMap<>();
//		Map<String,Map<String,List<Datatype>>> datatypesbyVersionThenName = new HashMap<>();
//		Map<String,Map<Set<String>,List<Datatype>>> datatypesbyNameThenVersion = new HashMap<>();
//		
//		List<String> listIDs = new ArrayList<String>();
//
//
//
//		List<String> versionSets = new ArrayList<String>();
//		Set<String> hs = new HashSet<>();
//		List<String> orderedVersionList = new ArrayList();
//		
//
//
//
//		for(Datatype datatype : datatypesMap.values()) {
//			listIDs.add(datatype.getId());
//			
//		}
//
//		
//		for(Datatype datatype : datatypesMap.values()) {
//			if(datatypesbyRoot.containsKey(datatype.getName())){
//				datatypesbyRoot.get(datatype.getName()).add(datatype);
//			}else {
//				List<Datatype> listDataype = new ArrayList<Datatype>();
//				listDataype.add(datatype);
//				datatypesbyRoot.put(datatype.getName(), listDataype);
//			}
//			
//			hs.addAll(datatype.getDomainInfo().getCompatibilityVersion());
//			versionSets.addAll(datatype.getDomainInfo().getCompatibilityVersion());
//			List list = new ArrayList(hs);
//			Collections.sort(list);
//			datatypesMap.put(datatype.getId(), datatype);
//			datatypeNamesMap.put(datatype.getId(), datatype.getName());
//			orderedVersionList = list;
//
//		}
//		
//		myExportObject.setDatatypeNamesMap(datatypeNamesMap);
//		myExportObject.setAllDomainCompatibilityVersions(orderedVersionList);
//
//		for(String key : datatypesMap.keySet()) {
//			Datatype datatype = datatypesMap.get(key);
//			if(datatype instanceof ComplexDatatype) {
//				for(Component component : ((ComplexDatatype) datatype).getComponents()) {
//					if(component.getRef() != null && !datatypeNamesMap.containsKey(component.getRef())) {
//						Datatype datatype2 = datatypeService.findById(component.getRef().getId());
//						datatypeNamesMap.put(component.getRef().getId(), datatype2.getName());
//					}
//				}
//			}
//			
//			
//			
//		}
//		
//		int position = 0;
//		String Encoding = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
//		allDatatypesXml = Encoding + "<Datatypes>";
//		for(String key : datatypesMap.keySet()) {
//			Datatype datatype = datatypesMap.get(key);
//			if(!datatype.getName().equals("-")) {
//			SerializableDatatypeForWeb serializableDatatypeForWeb = new SerializableDatatypeForWeb(datatype,String.valueOf(position),datatypeNamesMap);
//			try {
//				String datatypeXmlWhitoutEncoding = serializableDatatypeForWeb.serialize().toXML();
//				String datatypeXml = Encoding + datatypeXmlWhitoutEncoding;
//				position++;
//				allDatatypesXml = allDatatypesXml + datatypeXmlWhitoutEncoding;
//				datatypesXMLOneByOne.put(String.valueOf(position), datatypeXml);
//				mapDatatypeToXML.put(datatype, datatypeXml);
//			} catch (ResourceSerializationException e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//			}
//		}
//		allDatatypesXml = allDatatypesXml + "</Datatypes>";
//		System.out.println(allDatatypesXml);
//
//		myExportObject.setAllDatatypesXml(allDatatypesXml);
//		myExportObject.setDatatypesXMLOneByOne(datatypesXMLOneByOne);
//		
//		String allRootDatatypeXML = "";
//		
//		for(String key : datatypesbyRoot.keySet()) {
//			 allRootDatatypeXML = "<Datatypes>";
//			for(Datatype datatype : datatypesbyRoot.get(key)) {
//				SerializableDatatypeForWeb serializableDatatypeForWeb = new SerializableDatatypeForWeb(datatype,String.valueOf(position),datatypeNamesMap);
//			try {
//				String datatypeXml = serializableDatatypeForWeb.serialize().toXML();
//
//				allRootDatatypeXML = allRootDatatypeXML + datatypeXml;
//				position++;
//			} catch (ResourceSerializationException e1) {
//				e1.printStackTrace();
//			}
//			
//		}
//			allRootDatatypeXML = allRootDatatypeXML + "</Datatypes>";
//			datatypesXMLbyRoot.put(key, allRootDatatypeXML);
//
//		}
//
//		
//		for(String version : orderedVersionList) {
//			for(Datatype datatype : datatypesMap.values()) {
//				if(!datatype.getExt().isEmpty()) {
//				if(datatype.getDomainInfo().getCompatibilityVersion().contains(version)) {
//					if(datatypesbyVersionThenName.containsKey(version)){
//						if(datatypesbyVersionThenName.get(version).containsKey(datatype.getName())) {
//							datatypesbyVersionThenName.get(version).get(datatype.getName()).add(datatype);
//						}else {
//							List<Datatype> listDataype = new ArrayList<Datatype>();
//							listDataype.add(datatype);
//							datatypesbyVersionThenName.get(version).put(datatype.getName(), listDataype);
//						}
//					}else {
//						List<Datatype> listDataype = new ArrayList<Datatype>();
//						listDataype.add(datatype);
//						Map<String,List<Datatype>> newmap = new HashMap<>();
//						newmap.put(datatype.getName(), listDataype);
//						datatypesbyVersionThenName.put(version, newmap);
//					}		
//				}
//
//			}
//			}
//
//		}
//		
//		
//		for(String name : datatypesbyRoot.keySet()) {
//			for(Datatype datatype : datatypesMap.values()) {
//				if(!datatype.getExt().isEmpty()) {
//				if(datatype.getName().equals(name) ) {
//				if(datatypesbyNameThenVersion.containsKey(name)) {
//					Set<String> versionSet = new HashSet<>();
//						if(datatypesbyNameThenVersion.get(name).keySet().contains(datatype.getDomainInfo().getCompatibilityVersion())) {
//								datatypesbyNameThenVersion.get(name).get(datatype.getDomainInfo().getCompatibilityVersion()).add(datatype);
//								
//						} else {
//							List<Datatype> listDataype = new ArrayList<Datatype>();
//							listDataype.add(datatype);
//							datatypesbyNameThenVersion.get(name).put(datatype.getDomainInfo().getCompatibilityVersion(), listDataype);					}	
//				} else { 
//					Map<Set<String>,List<Datatype>> newmap = new HashMap<>();
//					Set<String> versionSet = new HashSet<>();
//					List<Datatype> listDataype = new ArrayList<Datatype>();
//					listDataype.add(datatype);
//					newmap.put(datatype.getDomainInfo().getCompatibilityVersion(), listDataype);
//						datatypesbyNameThenVersion.put(name, newmap);
//
//					}	
//				}
//			}
//			}
//			}
//
//		myExportObject.setDatatypesXMLByRoot(datatypesXMLbyRoot);
//		myExportObject.setDatatypesbyVersionThenName(datatypesbyVersionThenName);
//		myExportObject.setDatatypesbyNameThenVersion(datatypesbyNameThenVersion);
//		myExportObject.setMapDatatypeToXML(mapDatatypeToXML);
//		return myExportObject;
//	}
//
//}
