package gov.nist.hit.hl7.igamt.ig.controller.wrappers;

import gov.nist.hit.hl7.igamt.common.base.domain.Registry;
import gov.nist.hit.hl7.igamt.common.base.domain.display.DisplayElement;

public class CreateChildResponse {
    private String id;
    private Registry registry;
    private DisplayElement display;

    public CreateChildResponse(String id, Registry registry, DisplayElement display) {
        this.id = id;
        this.registry = registry;
        this.display = display;
    }

    public CreateChildResponse() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Registry getRegistry() {
        return registry;
    }

    public void setRegistry(Registry registry) {
        this.registry = registry;
    }

    public DisplayElement getDisplay() {
        return display;
    }

    public void setDisplay(DisplayElement display) {
        this.display = display;
    }
}
