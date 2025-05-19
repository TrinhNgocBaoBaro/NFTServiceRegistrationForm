import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";

const CollaboratorForm = () => {

useEffect(() => {
    const script = document.createElement("script");
    script.src = "//js-na2.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "242731871",
          formId: "08984fa4-d386-4a70-967e-f2ecd4f1b635",
          region: "na2",
          target: "#hubspot-Form",
        });
      }
    };

    document.body.appendChild(script);
  }, []);

    return (
        <div className="container container-form-embed">
            <div id="hubspot-Form">
            </div>
        </div>
      )
}
export default CollaboratorForm;