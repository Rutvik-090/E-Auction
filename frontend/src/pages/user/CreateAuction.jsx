// import { ImagePlus } from "lucide-react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const CreateAuction = () => {
//   const navigate = useNavigate();

//   const [form, setform] = useState({
//     title: "",
//     description: "",
//     startingBid: "",
//     endDate: "",
//   });

//   const [imagePreview, setImagePreview] = useState(null);

//   const handleChange = (e) => {
//     setform({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log("Auction Data:", form);

//     alert("Auction created (frontend only)");

//     navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 px-6 py-10">
//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
//         <h1 className="text-2xl font-bold mb-6">Create New Auction</h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm font-medium">Auction Title</label>
//             <input
//               type="text"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               required
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium">Description</label>
//             <textarea
//               name="description"
//               rows="4"
//               value={form.description}
//               onChange={handleChange}
//               required
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             />
//           </div>

//           {/* Starting Bid */}
//           <div>
//             <label className="block text-sm font-medium">
//               Starting Bid (₹)
//             </label>
//             <input
//               type="number"
//               name="startingBid"
//               value={form.startingBid}
//               onChange={handleChange}
//               required
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             />
//           </div>

//           {/* End Date */}
//           <div>
//             <label className="block text-sm font-medium">
//               Auction End Date & Time
//             </label>
//             <input
//               type="datetime-local"
//               name="endDate"
//               value={form.endDate}
//               onChange={handleChange}
//               required
//               className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//             />
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium">Upload Image</label>

//             <label className="flex items-center justify-center gap-2 mt-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
//               <ImagePlus />
//               <span>Click to upload image</span>
//               <input
//                 type="file"
//                 className="hidden"
//                 onChange={handleImage}
//                 accept="image/*"
//               />
//             </label>

//             {imagePreview && (
//               <img
//                 src={imagePreview}
//                 alt="Preview"
//                 className="mt-4 w-full h-60 object-cover rounded-lg"
//               />
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
//           >
//             Create Auction
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export const CreateAuction = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    startingBid: "",
    endTime: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle image upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("startingBid", form.startingBid);
      formData.append("endTime", form.endTime);
      formData.append("image", image);

      await API.post("/auctions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/auctions");
    } catch (err) {
      console.log(localStorage.getItem("user"));
      setError(err.response?.data?.message || "Failed to create auction");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-6">Create New Auction</h1>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium">Auction Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Starting Bid */}
            <div>
              <label className="block text-sm font-medium">
                Starting Bid (₹)
              </label>
              <input
                type="number"
                name="startingBid"
                value={form.startingBid}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium">
                Auction End Date & Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium">Upload Image</label>

              <label className="flex items-center justify-center gap-2 mt-2 p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <ImagePlus />
                <span>Click to upload image</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImage}
                  accept="image/*"
                />
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 w-full h-60 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
            >
              Create Auction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
