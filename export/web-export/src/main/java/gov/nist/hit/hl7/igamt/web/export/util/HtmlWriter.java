//package gov.nist.hit.hl7.igamt.web.export.util;
//
//import static j2html.TagCreator.a;
//import static j2html.TagCreator.attrs;
//import static j2html.TagCreator.body;
//import static j2html.TagCreator.div;
//import static j2html.TagCreator.each;
//import static j2html.TagCreator.h4;
//import static j2html.TagCreator.head;
//import static j2html.TagCreator.html;
//import static j2html.TagCreator.link;
//import static j2html.TagCreator.nav;
//import static j2html.TagCreator.span;
//import static j2html.TagCreator.strong;
//import static j2html.TagCreator.table;
//import static j2html.TagCreator.tbody;
//import static j2html.TagCreator.td;
//import static j2html.TagCreator.th;
//import static j2html.TagCreator.thead;
//import static j2html.TagCreator.tr;
//import static j2html.TagCreator.br;
//import static j2html.TagCreator.h2;
//
//import java.io.BufferedReader;
//import java.io.BufferedWriter;
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.FileReader;
//import java.io.IOException;
//import java.io.OutputStreamWriter;
//import java.io.Writer;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.zip.ZipOutputStream;
//
//import org.apache.commons.io.FileUtils;
//
//import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
//import gov.nist.hit.hl7.igamt.web.export.model.MyExportObject;
//import j2html.tags.ContainerTag;
//
//public class HtmlWriter {
//
//	public void generateHtmlVersionsThenName(MyExportObject myExportObject, ZipOutputStream zipStream)
//			throws IOException {
//		Map<String, Map<String, List<Datatype>>> datatypesbyVersionThenName = myExportObject
//				.getDatatypesbyVersionThenName();
//
//		for (String version : datatypesbyVersionThenName.keySet()) {
//
//			String tableDatatypesByVersion = span(h2("Table of Datatypes and their flavors for version_" + version),
//
//					table(attrs(".greyGridTable1"),
//
//							thead(tr(th("Datatype"), th("Flavors"))),
//							tbody(each(datatypesbyVersionThenName.get(version).keySet(), name -> tr(
//									td(a(name).withHref("Datatype_" + name + ".html")).attr("bgcolor", "#ffcccc"),
//									td(span(each(datatypesbyVersionThenName.get(version).get(name),
//											datatype -> span(
//													a(datatype.getName() + datatype.getExt()).withHref("LeafTableForDatatype_"
//															+ datatype.getName() +datatype.getId()+ ".html"),
//													span(", ")).withId("p1")),
//											a("See all at once").withHref("AllDatatypesVersion_" + version + "ForRoot_"
//													+ name + ".html")))))))).render();
//			// System.out.println(tableDatatypesByVersion);
//
//			PageCreator pg = new PageCreator();
//			String resultPage = pg.createPage(Tools.getPathFileFromResources("ForJava/StructureForTables.html"),
//					"<TagToReplace></TagToReplace>", tableDatatypesByVersion);
//
//
////			FileUtils.writeStringToFile(new File("DatatypesForVersion_" + version + ".html"), resultPage);
//			ZipOutputStreamClass.addFileToZip(zipStream, "Pages/", "DatatypesForVersion_" + version + ".html",
//					resultPage);
//
//		}
//	}
//
//	public void generateHtmlNameThenVersion(MyExportObject myExportObject, ZipOutputStream zipStream)
//			throws IOException {
//		Map<String, Map<Set<String>, List<Datatype>>> datatypesbyNameThenVersion = myExportObject
//				.getDatatypesbyNameThenVersion();
//		// System.out.println("REGARDE ICI : "
//		// +datatypesbyNameThenVersion.keySet().toString());
//		for (String name : datatypesbyNameThenVersion.keySet()) {
//
//			String tableDatatypesByNameThenVersion =
//
//					table(attrs(".greyGridTable2"), thead(tr(th("Datatype"), th("Compatibility Versions And Flavors")
//
//					),
//
//							tbody(tr(td(a(name).withHref("Datatype_" + name + ".html")).attr("bgcolor", "#eee"),
//									td(table(attrs(".greyGridTable2"),
//											tbody(each(datatypesbyNameThenVersion.get(name).keySet(), versionSet -> tr(
//													td(each(versionSet,
//															version -> span(
//																	a(version).withHref(
//																			"DatatypesForVersion_" + version + ".html"),
//																	br()))).attr("bgcolor", "#ffcccc"),
//													td(span(each(datatypesbyNameThenVersion.get(name).get(versionSet),
//															datatype -> span(
//																	a(datatype.getName() + datatype.getExt())
//																			.withHref("LeafTableForDatatype_" + datatype.getName()
//																					+ datatype.getId()+".html"),
//																	br()).withId("p1")),
//															a("See all at once").withHref("AllDatatypesForRoot_" + name
//																	+ "Version_" + versionSet + ".html")))))))))))
// 
//					).render();
//			// System.out.println("XMLL: " +tableDatatypesByNameThenVersion);
//
//			PageCreator pg = new PageCreator();
//			String resultPage = pg.createPage(Tools.getPathFileFromResources("ForJava/StructureForTables.html"),
//					"<TagToReplace></TagToReplace>", tableDatatypesByNameThenVersion);
//			ZipOutputStreamClass.addFileToZip(zipStream, "Pages/", "Datatype_" + name + ".html", resultPage);
//
//		}
//	}
//
//	public String generateVersionInIndex(MyExportObject myExportObject) {
//		List<String> versionList = myExportObject.getAllDomainCompatibilityVersions();
//		List<String> versionList2 = new ArrayList<String>();
//		
//		for(String version : versionList) {
//			versionList2.add(" " + version);
//		}
//		
//
//		String versionInIndex = span(
//				each(versionList, version -> span(a(version).withHref("Pages/DatatypesForVersion_" + version + ".html"),
//						span(","), br()))).render();
//		// System.out.println(versionInIndex);
//		return versionInIndex;
//	}
//
//}