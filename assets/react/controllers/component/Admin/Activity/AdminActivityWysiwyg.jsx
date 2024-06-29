import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AdminActivityWysiwyg = ({ value, onChange, className }) => {
  const modules = {
    toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic"]],
  };

  const formats = ["header", "bold", "italic"];

  return (
    <section className={className}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </section>
  );
};

export default AdminActivityWysiwyg;
