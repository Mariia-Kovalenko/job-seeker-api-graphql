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

type JobInput = {
    title: string;
    shortDescription?: string;
    description: string;
    company: string;
    location?: string;
    salaryRange?: string;
    stack?: string[];
    category: string[]; // Updated to array
    workType: "Remote" | "In Office";
};

export const jobResolver = {
    Query: {
        // first - number of jobs to return per page
        // after - cursor to the next page
        jobs: async (
            _: any,
            { search = '', location = '', workType, categories = [], first = 10, after }:
            { search: string, location: string, workType?: string, categories: string[], first: number, after: string }
        ) => {
            const query: any = {};

            console.log('query in jobs resolver', location, workType, categories, search);

            // Search by position title or description
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Filter by location
            if (location) {
                query.location = { $regex: location, $options: 'i' };
            }

            // Filter by workType
            if (workType && workType.toLowerCase() == 'any') {
                workType = '';
            } 
            if (workType) {
                query.workType = { $regex: workType, $options: 'i' };
            }

            // Filter by categories
            if (categories.length > 0) {
                query.category = { $in: categories.map(cat => new RegExp(cat, 'i')) };
            }

            // Cursor-based pagination
            if (after) {
                query._id = { $gt: after };
            }

            const jobs = await JobModel.find(query)
                .sort({ _id: 1 })
                .limit(first + 1);

            const edges = jobs.map((job) => ({
                cursor: job._id,
                node: job,
            }));

            const hasNextPage = jobs.length > first;
            const endCursor =
                hasNextPage && jobs[first] ? jobs[first]._id : null;

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
            _: any,
            {
                title,
                shortDescription,
                description,
                company,
                location,
                salaryRange,
                stack,
                category,
                workType,
            }: JobInput,
            { user }: { user: any }
        ) => {
            if (!user) {
                throw new Error("User not authenticated");
            }
            console.log('user in addJob resolver', user);
            const newJob = await JobModel.create({
                title,
                shortDescription,
                description,
                company,
                location,
                salaryRange,
                stack,
                category,
                workType,
                posted_by: user.id,
            });

            console.log('newJob in addJob resolver', newJob);
            return newJob;
        },

        updateJob: async (
            _: any,
            {
                _id,
                title,
                shortDescription,
                description,
                company,
                location,
                salaryRange,
                stack,
                category,
                workType,
            }: Partial<JobInput> & { _id: string },
            { user }: { user: any }
        ) => {
            if (!user) {
                throw new Error("User not authenticated");
            }
            const updatedJob = await JobModel.findByIdAndUpdate(
                _id,
                {
                    title,
                    shortDescription,
                    description,
                    company,
                    location,
                    salaryRange,
                    stack,
                    category,
                    workType,
                    posted_by: user.id,
                },
                { new: true }
            );
            return updatedJob;
        },

        deleteJob: async (
            _: any,
            { id }: { id: string },
            { user }: { user: any }
        ) => {
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
