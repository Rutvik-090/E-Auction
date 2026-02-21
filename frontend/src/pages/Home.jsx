// import { Link } from "react-router-dom";

// export const Home = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <section className="bg-white py-20">
//         <div className="max-w-6xl mx-auto px-6 text-center">
//           <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
//             Bid Smart. Win Big.
//           </h1>

//           <p className="mt-6 text-lg text-gray-600">
//             Discover exclusive auctions and compete in real-time.
//           </p>

//           <div className="mt-8 flex justify-center gap-4">
//             <Link
//               to="/auctions"
//               className="bg-black text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
//             >
//               Browse Auctions
//             </Link>

//             <Link
//               to="/create-auction"
//               className="border border-black px-6 py-3 rounded-lg hover:bg-black hover:text-white transition"
//             >
//               Start Selling
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Featured Auctions Section */}
//       <section className="py-16">
//         <div className="max-w-6xl mx-auto px-6">
//           <h2 className="text-2xl font-semibold mb-8 text-gray-800">
//             Featured Auctions
//           </h2>

//           <div className="grid md:grid-cols-3 gap-6">
//             {/* Temporary Dummy Cards */}
//             {[1, 2, 3].map((item) => (
//               <div
//                 key={item}
//                 className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
//               >
//                 <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>

//                 <h3 className="text-lg font-semibold">Luxury Watch #{item}</h3>

//                 <p className="text-gray-500 text-sm mt-2">
//                   Current Bid: ₹25,000
//                 </p>

//                 <Link
//                   to="/auctions"
//                   className="block mt-4 text-center bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
//                 >
//                   View Auction
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 bg-linear-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-linear(circle_at_top_right,white,transparent_40%)]"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Elevate Every Bid.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover rare collections, compete in real-time, and experience
            auctions reimagined for the modern era.
          </p>

          <div className="mt-10 flex justify-center gap-6">
            <Link
              to="/auctions"
              className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:scale-105 transition duration-300 shadow-lg"
            >
              Explore Auctions
            </Link>

            <Link
              to="/create-auction"
              className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-black transition duration-300"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Auctions Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-gray-800 text-center">
            Featured Collections
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-500"
              >
                <div className="h-56 bg-linear-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition duration-500"></div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Limited Edition Watch #{item}
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm">Current Bid</p>

                  <p className="text-2xl font-bold text-black mt-1">₹25,000</p>

                  <Link
                    to="/auctions"
                    className="mt-6 inline-block w-full text-center bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Call to Action Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-gray-800">
            Ready to Make Your Move?
          </h3>

          <p className="mt-4 text-gray-600">
            Join thousands of collectors and sellers shaping the future of
            online auctions.
          </p>

          <Link
            to="/signup"
            className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition duration-300 shadow-md"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};
