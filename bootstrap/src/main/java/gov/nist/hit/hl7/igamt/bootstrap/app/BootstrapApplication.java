package gov.nist.hit.hl7.igamt.bootstrap.app;


import static org.hamcrest.CoreMatchers.instanceOf;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Properties;
import java.util.Set;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;

import ca.uhn.fhir.context.FhirContext;
import gov.nist.hit.hl7.igamt.bootstrap.data.DataFixer;
import gov.nist.hit.hl7.igamt.bootstrap.data.TablesFixes;
import gov.nist.hit.hl7.igamt.bootstrap.factory.BindingCollector;
import gov.nist.hit.hl7.igamt.bootstrap.factory.MessageEventFacory;
import gov.nist.hit.hl7.igamt.coconstraints.xml.generator.CoConstraintXmlGenerator;
import gov.nist.hit.hl7.igamt.common.base.domain.Resource;
import gov.nist.hit.hl7.igamt.common.base.domain.Scope;
import gov.nist.hit.hl7.igamt.common.base.domain.StructureElement;
import gov.nist.hit.hl7.igamt.common.base.domain.Type;
import gov.nist.hit.hl7.igamt.common.base.domain.Usage;
import gov.nist.hit.hl7.igamt.common.base.domain.ValuesetBinding;
import gov.nist.hit.hl7.igamt.common.base.exception.ValidationException;
import gov.nist.hit.hl7.igamt.common.binding.domain.ResourceBinding;
import gov.nist.hit.hl7.igamt.common.binding.domain.StructureElementBinding;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.BindingLocationOption;
import gov.nist.hit.hl7.igamt.common.config.domain.Config;
import gov.nist.hit.hl7.igamt.common.config.domain.ConnectingInfo;
import gov.nist.hit.hl7.igamt.common.config.domain.VersionRepresntation;
import gov.nist.hit.hl7.igamt.common.config.service.ConfigService;
import gov.nist.hit.hl7.igamt.conformanceprofile.domain.ConformanceProfile;
import gov.nist.hit.hl7.igamt.conformanceprofile.service.ConformanceProfileService;
import gov.nist.hit.hl7.igamt.datatype.domain.ComplexDatatype;
import gov.nist.hit.hl7.igamt.datatype.domain.Datatype;
import gov.nist.hit.hl7.igamt.datatype.exception.DatatypeNotFoundException;
import gov.nist.hit.hl7.igamt.datatype.service.DatatypeService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassificationService;
import gov.nist.hit.hl7.igamt.datatypeLibrary.service.DatatypeClassifier;
import gov.nist.hit.hl7.igamt.datatypeLibrary.util.EvolutionPropertie;
import gov.nist.hit.hl7.igamt.export.configuration.domain.ExportConfiguration;
import gov.nist.hit.hl7.igamt.export.configuration.repository.ExportConfigurationRepository;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportConfigurationService;
import gov.nist.hit.hl7.igamt.export.configuration.service.ExportFontConfigurationService;
import gov.nist.hit.hl7.igamt.segment.domain.Field;
import gov.nist.hit.hl7.igamt.segment.domain.Segment;
import gov.nist.hit.hl7.igamt.segment.service.SegmentService;
import gov.nist.hit.hl7.igamt.valueset.domain.property.Constant;

@SpringBootApplication
//@EnableMongoAuditing
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class,
    DataSourceTransactionManagerAutoConfiguration.class, HibernateJpaAutoConfiguration.class})
@EnableMongoRepositories("gov.nist.hit.hl7")
@ComponentScan({"gov.nist.hit.hl7", "gov.nist.hit.hl7.auth.util.crypto","gov.nist.hit.hl7.auth.util.service"})
@EnableScheduling
public class BootstrapApplication implements CommandLineRunner {

  private static final String EMAIL_PORT = "email.port";
  private static final String EMAIL_PROTOCOL = "email.protocol";
  private static final String EMAIL_HOST = "email.host";
  private static final String EMAIL_ADMIN = "email.admin";
  private static final String EMAIL_FROM = "email.from";
  private static final String EMAIL_SUBJECT = "email.subject";
  private static final String EMAIL_SMTP_AUTH = "email.smtp.auth";
  private static final String EMAIL_DEBUG = "email.debug";

  public static void main(String[] args) {
    SpringApplication.run(BootstrapApplication.class, args);
  }

  @Autowired
  ConfigService sharedConstantService;
//
//  @Autowired
//  DataFixer dataFixer;
  @Autowired
  private ExportConfigurationRepository exportConfigurationRepository;

  @Autowired
  MessageEventFacory messageEventFactory;

  @Autowired
  Environment env;

  @Autowired
  private ExportConfigurationService exportConfigurationService;

  //  @Autowired
  //  RelationShipService testCache;

  //  @Autowired
  //  DatatypeLibraryService dataypeLibraryService;
  //
  @Autowired
  DatatypeClassifier datatypeClassifier;

  //    @Autowired
  //    CoConstraintService ccService;
  //  @Autowired
  //  CoConstraintXmlGenerator ccXmlGen;
  //  
  @Autowired
  DatatypeService dataypeService;

  @Autowired
  SegmentService segmentService;

  @Autowired
  ConformanceProfileService messageService;
  @Autowired
  BindingCollector bindingCollector;
  @Autowired
  DatatypeClassificationService datatypeClassificationService;

  @Autowired
  TablesFixes tableFixes;



  @Bean
  public JavaMailSenderImpl mailSender() {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost(env.getProperty(EMAIL_HOST));
    mailSender.setPort(Integer.valueOf(env.getProperty(EMAIL_PORT)));
    mailSender.setProtocol(env.getProperty(EMAIL_PROTOCOL));
    Properties javaMailProperties = new Properties();
    //    javaMailProperties.setProperty("email.smtp.auth", env.getProperty(EMAIL_SMTP_AUTH));
    //    javaMailProperties.setProperty("mail.debug", env.getProperty(EMAIL_DEBUG));

    mailSender.setJavaMailProperties(javaMailProperties);
    return mailSender;
  }

  @Bean
  public org.springframework.mail.SimpleMailMessage templateMessage() {
    org.springframework.mail.SimpleMailMessage templateMessage =
        new org.springframework.mail.SimpleMailMessage();
    templateMessage.setFrom(env.getProperty(EMAIL_FROM));
    templateMessage.setSubject(env.getProperty(EMAIL_SUBJECT));
    return templateMessage;
  }

  @Bean()
  public FhirContext fhirR4Context() {
    return FhirContext.forR4();
  }

  //
  //   @Bean(name = "multipartResolver")
  //   public CommonsMultipartResolver multipartResolver() {
  //   CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
  //   return multipartResolver;
  //   }
  //   
  //   @Bean
  //   public GridFsTemplate gridFsTemplate() throws Exception {
  //       return new GridFsTemplate(mongoDbFactory(), mappingMongoConverter());
  //   }
  // @Bean
  // public FilterRegistrationBean jwtFilter() {
  // final FilterRegistrationBean registrationBean = new FilterRegistrationBean();Datatype
  // registrationBean.setFilter(new JwtFilter());
  // registrationBean.addUrlPatterns("/api/*");
  //
  // return registrationBean;
  // }


  @Override
  public void run(String... arg0) throws Exception {

    // accountService.findAll().get(0).getFullName();
    // List<Valueset> all = repo.findByDomainInfoScopeAndDomainInfoVersion("HL7STANDARD","2.7");
    // List<Valueset> bindingIdentifier = repo.findByBindingIdentifier("0001");
    // List<Valueset> scope = repo.findByDomainInfoScope("HL7STANDARD");
    // List<Valueset> scopeVersionIdentifier =
    // repo.findByDomainInfoScopeAndDomainInfoVersionAndBindingIdentifier("HL7STANDARD", "2.7",
    // "0001");
    //
    // List<Valueset> versionAndIDen=repo.findByDomainInfoScopeAndBindingIdentifier("HL7STANDARD",
    // "0001");
    //
    // System.out.println(all.size());
    // System.out.println(bindingIdentifier.size());
    // System.out.println(scope.size());
    // System.out.println(scopeVersionIdentifier.size());
    // System.out.println(versionAndIDen.size());


  }
  // @PostConstruct
  // void converAccounts() {
  //// try {
  //// Privilege user= new Privilege("USER");
  //// Privilege admin = new Privilege("ADMIN");
  ////
  //// priviliges.save(user);
  //// priviliges.save(admin);
  ////
  //// accountService.createAccountsFromLegacy();
  //// } catch (IOException e) {
  //// // TODO Auto-generated catch block
  //// e.printStackTrace();
  //// }
  //
  // }

  //
  //  @PostConstruct
  //  void createMessageEvent() {
  //    messageEventFactory.createMessageEvent();      
  //
  //    System.out.println("done");
  //
  //  }

  //@PostConstruct
  void fixUsage() throws ValidationException{
    List<Segment> segments = this.segmentService.findAll();
    for(Segment s : segments) {
      if(checkAndSetUsages(s.getChildren())) {
        segmentService.save(s);
      }


    }

    List<Datatype> datatypes = this.dataypeService.findAll();
    for(Datatype dataype : datatypes) {
      if(dataype instanceof ComplexDatatype) {
        if(this.checkAndSetUsages(((ComplexDatatype) dataype).getComponents())) {
          this.dataypeService.save(dataype);
        }
      }
    }



  }


  /**
   * @param set
   * @return
   */
  private <T extends StructureElement > boolean checkAndSetUsages(Set<T> set) {
    // TODO Auto-generated method stub
    boolean ret = false;
    for(StructureElement el: set) {
      if(el.getUsage() == null) {
        el.setUsage(Usage.O);
        ret=true;
      }
    }

    return ret;
  }


  /**
   * @param s
   */


  //@PostConstruct
  void generateDefaultExportConfig() {
    exportConfigurationRepository.deleteAll();
    List<ExportConfiguration> originals=  exportConfigurationRepository.findByOriginal(true);
    if( originals == null || originals.isEmpty()) {
      ExportConfiguration basicExportConfiguration = ExportConfiguration.getBasicExportConfiguration(false);
      basicExportConfiguration.setConfigName("Default Export Configuration");
      basicExportConfiguration.setOriginal(true);
      basicExportConfiguration.setConfigName("Default Export Configuration");
      basicExportConfiguration.setId("DEFAULT-CONFIG-ID");
      basicExportConfiguration.setDefaultType(false);
      basicExportConfiguration.setDefaultConfig(false);
      exportConfigurationRepository.save(basicExportConfiguration);
    }
  }
  //  
  //
  // @PostConstruct
  void updateGVTURL() {
    Config constant =  this.sharedConstantService.findOne();
    String redirectToken = "#/uploadTokens";
    String loginEndpoint = "api/accounts/login";
    String createDomainInput = "api/domains/new";

    List<ConnectingInfo> connection = new ArrayList<ConnectingInfo>();
    connection.add(new ConnectingInfo("GVT", "https://hl7v2.gvt.nist.gov/gvt/", redirectToken, loginEndpoint,createDomainInput, 1));

    connection.add(new ConnectingInfo("GVT-DEV", "https://hit-dev.nist.gov:8092/gvt/", redirectToken, loginEndpoint,createDomainInput, 2));

    connection.add(new ConnectingInfo("IZ-TOOL-DEV", "https://hit-dev.nist.gov:8098/iztool/", redirectToken, loginEndpoint,createDomainInput, 3));

    connection.add(new ConnectingInfo("IZ-TOOL", "https://hl7v2-iz-r1.5-testing.nist.gov/iztool/", redirectToken, loginEndpoint,createDomainInput, 4)); 
    constant.setConnection(connection); 
    this.sharedConstantService.save(constant);
  }

  void createSharedConstant() {
    Config constant = new Config();
    this.sharedConstantService.deleteAll();

    List<String> hl7Versions = new ArrayList<String>();
    hl7Versions.add("2.3.1");
    hl7Versions.add("2.4");
    hl7Versions.add("2.5");
    hl7Versions.add("2.5.1");
    hl7Versions.add("2.6");
    hl7Versions.add("2.7");
    hl7Versions.add("2.7.1");
    hl7Versions.add("2.8");
    hl7Versions.add("2.8.1");
    hl7Versions.add("2.8.2");

    List<String> usages = new ArrayList<String>();

    usages.add("R");
    usages.add("RE");
    usages.add("RC");
    usages.add("C");
    usages.add("X");
    constant.setHl7Versions(hl7Versions);
    constant.setUsages(usages);
    String redirectToken = "#/uploadTokens";
    String loginEndpoint = "api/accounts/login";
    String createDomainInput = "api/domains/new";


    List<ConnectingInfo> connection = new ArrayList<ConnectingInfo>();
    connection.add(new ConnectingInfo("GVT", "https://hl7v2.gvt.nist.gov/gvt/", redirectToken, loginEndpoint,createDomainInput, 1));

    connection.add(new ConnectingInfo("GVT-DEV", "https://hit-dev.nist.gov:8092/gvt/", redirectToken, loginEndpoint,createDomainInput, 2));

    connection.add(new ConnectingInfo("IZ-TOOL-DEV", "https://hit-dev.nist.gov:8098/iztool/", redirectToken, loginEndpoint,createDomainInput, 3));

    connection.add(new ConnectingInfo("IZ-TOOL", "https://hl7v2-iz-r1.5-testing.nist.gov/iztool/", redirectToken, loginEndpoint,createDomainInput, 4)); 
    constant.setConnection(connection);    
    constant.setPhinvadsUrl("https://phinvads.cdc.gov/vads/ViewValueSet.action?oid=");

    constant.setValueSetBindingConfig(generateValueSetConfig(constant.getHl7Versions()));

    HashMap<String, Object> froalaConfig = new HashMap<>();
    constant.setFroalaConfig(froalaConfig);
    sharedConstantService.save(constant);

  }

  // @PostConstruct
  void fixBindings() throws ValidationException {
    this.fixDatatypes(Scope.HL7STANDARD);
    this.fixMessages(Scope.HL7STANDARD);
    this.fixSegment(Scope.HL7STANDARD);
  }





  //
  // // @PostConstruct
  // void generateDatatypeLibrary()
  // throws JsonParseException, JsonMappingException, FileNotFoundException, IOException {
  // // DatatypeLibrary dataypeLibrary = dataypeLibraryService.createEmptyDatatypeLibrary();
  // //
  // // List<Datatype> intermasters = dataypeService.findByDomainInfoScope("INTERMASTER");
  // // List<Datatype> masters = dataypeService.findByDomainInfoScope("MASTER");
  // // if (masters.size() > 10 && intermasters.size() > 10)
  // // for (int i = 0; i < 10; i++) {
  // // if (intermasters.get(i) != null) {
  // // Link l = new Link(intermasters.get(i).getId(), intermasters.get(i).getDomainInfo(), i);
  // // dataypeLibrary.getDatatypeRegistry().getChildren().add(l);
  // // }
  // // if (masters.get(i) != null) {
  // // Link l = new Link(masters.get(i).getId(), masters.get(i).getDomainInfo(), i);
  // // dataypeLibrary.getDatatypeRegistry().getChildren().add(l);
  // // }
  // // }
  // // dataypeLibraryService.save(dataypeLibrary);
  //
  // }

  private HashMap<String, BindingInfo> generateValueSetConfig(List<String> versions) {
    HashMap<String,BindingInfo> ret= new HashMap<String,BindingInfo>();


    ret.put("ID", BindingInfo.createSimple());
    ret.put("IS", BindingInfo.createSimple());

    BindingLocationOption location1 = new BindingLocationOption();
    location1.setValue(Arrays.asList(1));
    location1.setLabel("1");

    BindingLocationOption location2 = new BindingLocationOption();
    location2.setValue(Arrays.asList(2));
    location2.setLabel("2");


    BindingLocationOption location4 = new BindingLocationOption();
    location4.setValue(Arrays.asList(4));
    location4.setLabel("4");

    BindingLocationOption location5 = new BindingLocationOption();
    location5.setValue(Arrays.asList(5));
    location5.setLabel("5");

    BindingLocationOption location2_5 = new BindingLocationOption();
    location2_5.setValue(Arrays.asList(2,5));
    location2_5.setLabel("2 or 5");


    BindingLocationOption location10= new BindingLocationOption();
    location10.setValue(Arrays.asList(10));
    location10.setLabel("10");

    BindingLocationOption location1_4 = new BindingLocationOption();
    location1_4.setValue(Arrays.asList(1,4));
    location1_4.setLabel("1 or 4");

    BindingLocationOption location1_4_10 = new BindingLocationOption();
    location1_4_10.setValue(Arrays.asList(1,4,10));
    location1_4_10.setLabel("1 or 4 or 10");	

    HashMap<String, List<BindingLocationOption>> allowedBindingLocations_coded =new HashMap<String, List<BindingLocationOption>>();


    List<BindingLocationOption> oldOptions1= Arrays.asList(location1,location4, location1_4);
    List<BindingLocationOption> newOption1= Arrays.asList(location1,location4,location10, location1_4, location1_4_10);
    List<BindingLocationOption> optionsHD= Arrays.asList(location1);
    List<BindingLocationOption> optionsCSU= Arrays.asList(location2,location5,location2_5);
    allowedBindingLocations_coded.put("2-3-1", oldOptions1);
    allowedBindingLocations_coded.put("2-4", oldOptions1);

    allowedBindingLocations_coded.put("2-5", oldOptions1);

    allowedBindingLocations_coded.put("2-5-1", oldOptions1);
    allowedBindingLocations_coded.put("2-6", oldOptions1);

    allowedBindingLocations_coded.put("2-7", newOption1);

    allowedBindingLocations_coded.put("2-7-1", newOption1);
    allowedBindingLocations_coded.put("2-8", newOption1);

    allowedBindingLocations_coded.put("2-8-1", newOption1);
    allowedBindingLocations_coded.put("2-8-2", oldOptions1);
    BindingInfo coded =  BindingInfo.createCoded();
    coded.setAllowedBindingLocations(allowedBindingLocations_coded);

    ret.put("CE", coded);
    ret.put("CWE", coded);
    ret.put("CNE", coded);
    ret.put("CF", coded);
    BindingInfo CSUInfo =  BindingInfo.createCoded();

    HashMap<String, List<BindingLocationOption>> allowedBindingLocations_CSU =new HashMap<String, List<BindingLocationOption>>();
    for(String v: versions) {
      allowedBindingLocations_CSU.put(v.replace('.', '-'), optionsCSU);
    }
    CSUInfo.setAllowedBindingLocations(allowedBindingLocations_CSU);
    ret.put("CSU", CSUInfo);

    BindingInfo HDInfo =  BindingInfo.createCoded();
    HDInfo.setCoded(false);
    HashMap<String, List<BindingLocationOption>> allowedBindingLocations_hd =new HashMap<String, List<BindingLocationOption>>();

    for(String v: versions) {
      allowedBindingLocations_hd.put(v.replace('.', '-'), optionsHD);
    }
    HDInfo.setAllowedBindingLocations(allowedBindingLocations_hd);
    ret.put("HD",HDInfo);

    BindingInfo stInfo = BindingInfo.createSimple();
    stInfo.setLocationIndifferent(false);

    Set<BindingLocationInfo> stExceptions = new HashSet<BindingLocationInfo>();
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AD", 3, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AD", 4, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AD", 5, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"AUI", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"CNN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"CX", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"EI", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"ERL", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"LA2", 11, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"LA2", 12, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"LA2", 13, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"ELD", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"OSD", 2, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"OSD", 3, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"PLN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"PPN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD", 4, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD",5, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XAD", 8, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XCN", 1, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XON", 3, versions ));
    stExceptions.add(new BindingLocationInfo(Type.DATATYPE,"XON", 10, versions ));
    stExceptions.add(new BindingLocationInfo(Type.SEGMENT,"PID", 23, versions ));
    stInfo.setLocationExceptions(stExceptions);
    ret.put("ST", stInfo);

    BindingInfo nmInfo = BindingInfo.createSimple();
    nmInfo.setLocationIndifferent(false);
    Set<BindingLocationInfo> nmExceptions = new HashSet<BindingLocationInfo>();
    nmExceptions.add(new BindingLocationInfo(Type.DATATYPE,"CK", 1, versions ));
    ret.put("NM", nmInfo);

    return ret;
  }

  
//  @PostConstruct
  void classifyDatatypes() throws DatatypeNotFoundException {
    datatypeClassificationService.deleteAll();
    System.out.println("Classifying dts");
    List<String> hl7Versions = sharedConstantService.findOne().getHl7Versions();
    HashMap<EvolutionPropertie, Boolean> criterias1 = new HashMap<EvolutionPropertie, Boolean>();
    criterias1.put(EvolutionPropertie.CPUSAGE, true);
    criterias1.put(EvolutionPropertie.CPDATATYPE, true);
    criterias1.put(EvolutionPropertie.CPNUMBER, true);
    datatypeClassifier.classify(hl7Versions,criterias1);
    System.out.println("ENd of Classifying dts");
   
  }


    //   }
    //  
    //@PostConstruct
    //void testCache() {
    //	testCache.deleteAll();
    //
    //  ResourceInfo info = new ResourceInfo();
    //  info.setId("user");
    //  info.setDomainInfo(null);
    //  info.setType(null);
    //  
    //  ResourceInfo info1 = new ResourceInfo();
    //  info1.setId("user1");
    //  info1.setDomainInfo(null);
    //  info1.setType(null);
    //  
    //  
    //  RelationShip r1 = new RelationShip(info, info1, ReferenceType.STRUCTURE, "test");
    //  RelationShip r2 = new RelationShip(info1, info, ReferenceType.STRUCTURE, "test");
    //
    //  
    //  testCache.save(r1);
    //  testCache.save(r2);
    //  
    //  System.out.println(testCache.findAll().size());
    //  
    //  List<RelationShip> dep =testCache.findAllDependencies("user");
    //  List<RelationShip>  refs=testCache.findCrossReferences("user");
    //  
    //  List<RelationShip>  byType=testCache.findByPath("test");
    //  List<RelationShip>  all=testCache.findAll();
    //  
    //  for( RelationShip r :all) {
    //	  System.out.println(r.getId());
    //  }
    //  System.out.println(dep);
    //  System.out.println(refs);
    //
    //}



    public void fixMessages(Scope scope) {
      List<ConformanceProfile> resources = messageService.findByDomainInfoScope(scope.getValue()); 
      for(ConformanceProfile r : resources) {
        if(r.getBinding() !=null) {
          fixBinding(r.getBinding());
          messageService.save(r);
        }
      }
    }
    public void fixDatatypes(Scope scope) {
      List<Datatype> resources = this.dataypeService.findByDomainInfoScope(scope.getValue()); 
      for(Datatype r : resources) {
        if(r.getBinding() !=null) {
          fixBinding(r.getBinding());
          dataypeService.save(r);
        }
      }	
    }
    public void fixSegment(Scope scope) throws ValidationException {
      List<Segment> resources = this.segmentService.findByDomainInfoScope(scope.getValue()); 
      for(Segment r : resources) {
        if(r.getBinding() !=null) {
          fixBinding(r.getBinding());
          segmentService.save(r);
        }
      }
    }

    public void fixBinding(ResourceBinding binding) {
      //		if(binding.getChildren() !=null && !binding.getChildren().isEmpty()) {
      //			for(StructureElementBinding elm: binding.getChildren()) {	
      //				if(elm.getValuesetBindings() != null) {
      //					for(ValuesetBinding vs: elm.getValuesetBindings()) {
      //						if(vs.getValuesetId() !=null) {
      //							List<String> list = new ArrayList<String>();
      //							list.add(vs.getValuesetId());
      //							vs.setValueSets(list);
      //						}
      //					}
      //				}
      //			}
      //		}	
    }

    //    @PostConstruct
    public void generateBindings() throws FileNotFoundException{
      this.bindingCollector.collect();
    };


    //@PostConstruct
//    public void fixBinding() throws ValidationException {
//      this.dataFixer.readCsv();
//    }

    // @PostConstruct
    public void fix0396() throws ValidationException{
      tableFixes.fix0396();
    }

    //   @PostConstruct
    //   void classifyDatatypes() throws DatatypeNotFoundException {
    //   datatypeClassificationService.deleteAll();
    //   System.out.println("Classifying dts");
    //   datatypeClassifier.classify();
    //   System.out.println("ENd of Classifying dts");
    //  
    //   }
    //  
    //@PostConstruct
    //void testCache() {
    //	testCache.deleteAll();
    //
    //  ResourceInfo info = new ResourceInfo();
    //  info.setId("user");
    //  info.setDomainInfo(null);
    //  info.setType(null);
    //  
    //  ResourceInfo info1 = new ResourceInfo();
    //  info1.setId("user1");
    //  info1.setDomainInfo(null);
    //  info1.setType(null);
    //  
    //  
    //  RelationShip r1 = new RelationShip(info, info1, ReferenceType.STRUCTURE, "test");
    //  RelationShip r2 = new RelationShip(info1, info, ReferenceType.STRUCTURE, "test");
    //
    //  
    //  testCache.save(r1);
    //  testCache.save(r2);
    //  
    //  System.out.println(testCache.findAll().size());
    //  
    //  List<RelationShip> dep =testCache.findAllDependencies("user");
    //  List<RelationShip>  refs=testCache.findCrossReferences("user");
    //  
    //  List<RelationShip>  byType=testCache.findByPath("test");
    //  List<RelationShip>  all=testCache.findAll();
    //  
    //  for( RelationShip r :all) {
    //	  System.out.println(r.getId());
    //  }
    //  System.out.println(dep);
    //  System.out.println(refs);
    //
    //}

  }
