const enqueteList = document.getElementById("enqueteList");

const getUserEnqueteList = async () => {
  const response = await fetch("http://localhost:3000/enquete", {
    credentials: "same-origin",
  });
  const userEnqueteList = response.json();
  return userEnqueteList;
};

const populateUserEnqueteList = async () => {
  const userEnqueteList = await getUserEnqueteList();
  userEnqueteList.forEach((enquete) => {
    const enqueteItem = document.createElement("li");
    enqueteItem.appendChild(document.createTextNode(enquete.title));
    enqueteList.appendChild(enqueteItem);
  });
};

populateUserEnqueteList();
