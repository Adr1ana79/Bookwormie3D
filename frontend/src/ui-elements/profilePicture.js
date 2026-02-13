// profilePicture.js

export function initProfilePictureModal() {

    const profileSection = document.getElementById("view-profile");
    const modal = document.getElementById("edit-profile-picture-modal");

    if (!profileSection || !modal) return;

    const editPictureBtn = profileSection.querySelector(".profile-picture-container .icon-edit");
    const profileImage = profileSection.querySelector(".profile-picture");

    const saveBtn = modal.querySelector("[data-close]");
    const cancelBtn = modal.querySelector("[data-confirm]");
    const fileInput = modal.querySelector("#file-upload");
    const previewImg = modal.querySelector("#preview-img");

    const presetOptions = modal.querySelectorAll('input[name="avatar"]');

    let tempImageSrc = profileImage.src; // временен state
    let originalImageSrc = profileImage.src;

    // --- OPEN MODAL ---
    editPictureBtn.addEventListener("click", () => {

        originalImageSrc = profileImage.src;
        tempImageSrc = originalImageSrc;

        modal.hidden = false;
    });

    // --- SELECT PRESET ---
    presetOptions.forEach(option => {
        option.addEventListener("change", (e) => {
            const selectedImg = e.target.closest("label").querySelector("img").src;

            previewImg.src = selectedImg;
            tempImageSrc = selectedImg;
        });
    });

    // --- UPLOAD CUSTOM IMAGE ---
    fileInput.addEventListener("change", (e) => {

        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
            previewImg.src = event.target.result;
            tempImageSrc = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    // --- SAVE ---
    saveBtn.addEventListener("click", () => {

        profileImage.src = tempImageSrc;

        modal.hidden = true;
    });

    // --- CANCEL ---
    cancelBtn.addEventListener("click", () => {

        profileImage.src = originalImageSrc;
        previewImg.src = originalImageSrc;

        modal.hidden = true;
    });
}
