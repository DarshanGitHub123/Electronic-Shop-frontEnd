export default function Dashboard() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border p-4">Total Products</div>
        <div className="border p-4">Total Orders</div>
        <div className="border p-4">Users</div>
        <div className="border p-4">Revenue</div>
      </div>
    );
  }
  