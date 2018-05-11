package gov.nist.hit.hl7.igamt.ig.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nist.hit.hl7.igamt.ig.domain.Ig;
import gov.nist.hit.hl7.igamt.ig.model.IGDisplay;
import gov.nist.hit.hl7.igamt.ig.model.IgSummary;
import gov.nist.hit.hl7.igamt.ig.service.IgService;


@RestController
public class IGDocumentController {

  @Autowired
  private IgService igService;

  public IGDocumentController() {
    // TODO Auto-generated constructor stub
  }


  @RequestMapping(value = "/api/igdocuments", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody List<IgSummary> getUserIG() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      String username = authentication.getPrincipal().toString();
      List<Ig> igdouments = igService.findLatestByUsername(username);
      return igService.convertListToDisplayList(igdouments);
    } else {
      throw new AuthenticationCredentialsNotFoundException("No Authentication ");
    }
  }


  @RequestMapping(value = "/api/igdocuments/{id}/display", method = RequestMethod.GET,
      produces = {"application/json"})

  public @ResponseBody IGDisplay getIgDisplay(@PathVariable("id") String id) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {


      Ig igdoument = igService.findLatestById(id);
      IGDisplay ret = igService.convertDomainToModel(igdoument);
      return ret;

    } else {
      return null;
    }

  }


  public IgService getIgService() {
    return igService;
  }


  public void setIgService(IgService igService) {
    this.igService = igService;
  }



}
