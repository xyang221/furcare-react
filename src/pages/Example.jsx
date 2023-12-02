import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <h2 style={{color: "green"}}>Attendance</h2>
      
      </div>
    );
  }
}

export default function PrintComdsdsponent() {
  let componentRef = useRef();

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
         bodyClass="print-agreement"
          trigger={() => <button>Print this out!</button>}
          content={() => componentRef}
        />

        {/* component to be printed */}
        <ComponentToPrint ref={(el) => (componentRef = el)} />
      </div>
    </>
  );
}
