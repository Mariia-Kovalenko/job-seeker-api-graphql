import JobModel from "../models/Job";

type Job = {
    _id: string;
    title: string;
    shortDescription?: string;
    description: string;
    company: string;
    location: string;
    salaryRange: string;
    stack: string[];
};
export const jobResolver = {
    Query: {
        jobs: async (_: any, { first = 10, after }: { first: number, after: string }) => {
            const query = after ? { _id: { $gt: after } } : {};
            const jobs = await JobModel.find(query).sort({ _id: 1 }).limit(first + 1);

            const edges = jobs.map(job => ({
              cursor: job._id,
              node: job
            }));

            const hasNextPage = jobs.length > first;
            const endCursor = hasNextPage && jobs[first] ? jobs[first]._id : null;

            return {
              edges: hasNextPage ? edges.slice(0, -1) : edges,
              pageInfo: {
                endCursor,
                hasNextPage,
              },
            };
          },
        job: async (_: any, { _id }: { _id: string }) => JobModel.findById(_id),
    },
    Mutation: {
      // parameters are: (parent, args, context)
      // parent is the parent of the field
      // args are the arguments passed to the field
      // context is the context object
        addJob: async (
            _: any, // _ is the parent of the field
            {
                title,
                shortDescription,
                description,
                company,
                location,
                salaryRange,
                stack,
            }: Job,
            { user }: { user: any }  // user is retrieved from the context in the index.ts file
        ) => {
           
            if (!user) {
                throw new Error("User not authenticated"); // if user is not authenticated, throw an error
            }
            return JobModel.create({
                title,
                shortDescription,
                description,
                company,
                location,
                salaryRange,
                stack,
                posted_by: user.id,
            });
        },

        updateJob: async (_: any, { _id, ...updateFields }: { _id: string, updateFields: any }, { user }: { user: any }) => {
          if (!user) {
            throw new Error("User not authenticated");
          }
          const job = await JobModel.findById(_id);
          if (!job) {
            throw new Error("Job not found");
          }
          if (job.posted_by.toString() !== user.id) {
            throw new Error("You are not authorized to update this job");
          }
          return JobModel.findByIdAndUpdate(_id, updateFields, { new: true });  
        },

        deleteJob: async (_: any, { id }: { id: string }, { user }: { user: any }) => {
            if (!user) {
                throw new Error("User not authenticated");
            }
            const job = await JobModel.findById(id);
            if (!job) {
                throw new Error("Job not found");
            }
            if (job.posted_by.toString() !== user.id) {
                throw new Error("You are not authorized to delete this job");
            }
            return JobModel.findByIdAndDelete(id);
        },
    },
};
