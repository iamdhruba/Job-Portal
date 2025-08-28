import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from "@/context/DataContexts";
import { motion } from "framer-motion";
import { Search, Trash2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";

const ManageJobs = () => {
  const { data, deleteItem, updateItem } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJobs = useMemo(() => {
    return data?.jobs?.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  }, [data?.jobs, searchTerm]);

  const toggleJobStatus = (job) => {
    updateItem('jobs', job.id, {
      ...job,
      status: job.status === 'active' ? 'inactive' : 'active'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Jobs</h1>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full shadow-sm focus:ring focus:ring-indigo-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No jobs found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-md rounded-lg overflow-hidden border"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                    <p className="text-gray-500 text-sm">{job.company}</p>
                    <p className="text-gray-500 text-sm mt-1">{job.location}</p>
                  </div>
                  <Badge
                    variant={job.status === 'active' ? 'outline' : 'destructive'}
                    className="uppercase px-2 py-1 text-xs"
                  >
                    {job.status}
                  </Badge>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-gray-400 text-sm">{job.postedDate}</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleJobStatus(job)}>
                      {job.status === 'active' ? <XCircle className="h-4 w-4 mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
                      {job.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteItem('jobs', job.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
