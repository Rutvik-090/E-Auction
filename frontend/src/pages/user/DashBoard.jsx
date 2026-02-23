import { Gavel, PlusCircle, Trophy, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const DashBoard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here’s what’s happening with your auctions today.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <Gavel className="text-blue-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">Active Bids</p>
                <h2 className="text-2xl font-bold">12</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <Trophy className="text-green-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">Auctions Won</p>
                <h2 className="text-2xl font-bold">3</h2>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center gap-4">
              <Wallet className="text-purple-500" size={28} />
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <h2 className="text-2xl font-bold">₹45,000</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/auctions"
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              <Gavel size={18} />
              Browse Auctions
            </Link>

            <Link
              to="/create-auction"
              className="flex items-center gap-2 border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
            >
              <PlusCircle size={18} />
              Create Auction
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-4 text-sm text-gray-600">
            <p>• You placed a bid on "Luxury Watch"</p>
            <p>• You won "Vintage Painting"</p>
            <p>• Auction "Gaming Laptop" ends in 2 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};
