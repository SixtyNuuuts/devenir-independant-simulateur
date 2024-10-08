import React, { useState } from "react";
import AdminObjectiveList from "./AdminActivityObjectiveList";
import useUploadImage from "../../../hook/useUploadImage";

const AdminActivityHeader = ({
  activity,
  handleInputChange,
  handleAddObjective,
  handleObjectiveChange,
  handleRemoveObjective,
  setActivity,
}) => {
  const { uploadImage } = useUploadImage();
  const [previewMobileImage, setPreviewMobileImage] = useState(
    activity.mobileImage
  );
  const [previewDesktopImage, setPreviewDesktopImage] = useState(
    activity.desktopImage
  );

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (type === "mobileImage") {
          setPreviewMobileImage(reader.result);
        } else if (type === "desktopImage") {
          setPreviewDesktopImage(reader.result);
        }
        const name = `${activity.slug}-${type}`;
        const result = await uploadImage(file, type, name);

        if (result.url) {
          setActivity((prevActivity) => ({
            ...prevActivity,
            [type]: result.url,
          }));
        } else {
          console.error(result); // Handle the error accordingly
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="admin-div">
        <textarea
          name="title"
          className="home-title"
          value={activity.title}
          onChange={(e) => handleInputChange(e, setActivity)}
        />
        <AdminObjectiveList
          objectives={activity.objectives}
          handleObjectiveChange={(index, value) =>
            handleObjectiveChange(index, value, setActivity)
          }
          handleAddObjective={() => handleAddObjective(setActivity)}
          handleRemoveObjective={(index) =>
            handleRemoveObjective(index, setActivity)
          }
        />
      </div>
      <figure>
        <picture>
          <label className="mobile-image btn-secondary btn-s">
            Image mobile
            <input
              type="file"
              name="mobileImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "mobileImage")}
            />
          </label>
          <label className="desktop-image btn-secondary btn-s">
            Image desktop
            <input
              type="file"
              name="desktopImage"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "desktopImage")}
            />
          </label>
          <source media="(max-width: 768px)" srcSet={previewMobileImage} />
          <source media="(min-width: 769px)" srcSet={previewDesktopImage} />
          <img
            src={previewDesktopImage}
            alt={`Image de l'activité ${activity.name}`}
            title={`Image de l'activité ${activity.name}`}
          />
        </picture>
      </figure>
    </>
  );
};

export default AdminActivityHeader;
