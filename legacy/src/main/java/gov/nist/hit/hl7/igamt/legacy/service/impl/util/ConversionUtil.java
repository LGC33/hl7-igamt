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
package gov.nist.hit.hl7.igamt.legacy.service.impl.util;

import gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Constant.SCOPE;
import gov.nist.hit.hl7.igamt.shared.domain.Scope;
import gov.nist.hit.hl7.igamt.shared.domain.Usage;

/**
 *
 * @author Maxence Lefort on Mar 8, 2018.
 */
public class ConversionUtil {

  public static Scope convertScope(SCOPE scope) {
    if(scope.equals(SCOPE.HL7STANDARD)) {
      return Scope.HL7STANDARD;
    } else if (scope.equals(SCOPE.ARCHIVED)) {
      return Scope.ARCHIVED;
    } else if (scope.equals(SCOPE.INTERMASTER)) {
      return Scope.INTERMASTER;
    } else if (scope.equals(SCOPE.MASTER)) {
      return Scope.MASTER;
    } else if (scope.equals(SCOPE.PHINVADS)) {
      return Scope.PHINVADS;
    } else if (scope.equals(SCOPE.PRELOADED)) {
      return Scope.PRELOADED;
    } else if (scope.equals(SCOPE.USER)) {
      return Scope.USER;
    }
    return null;
  }
  
  public static Usage convertUsage(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage usage) {
    if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.R)) {
      return Usage.R;
    } else if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.RE)) {
      return Usage.RE;
    } else if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.C)) {
      return Usage.C;
    } else if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.O)) {
      return Usage.O;
    } else if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.X)) {
      return Usage.X;
    } else if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.B)) {
      return Usage.B;
    } else if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.W)) {
      return Usage.W;
    } else if(usage.equals(gov.nist.healthcare.tools.hl7.v2.igamt.lite.domain.Usage.CE)) {
      return Usage.CE;
    }
    return null;
  }
}
