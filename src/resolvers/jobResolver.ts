import JobModel from '../models/Job';

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
    jobs: async () => JobModel.find(),
    job: async (_: any, { _id }: { _id: string }) =>
      JobModel.findById(_id)
  },
  Mutation: {
    addJob: async (_: any, { title, shortDescription, description, company, location, salaryRange, stack }: Job) => 
      JobModel.create({ title, shortDescription, description, company, location, salaryRange, stack }),

    updateJob: async (_: any, { _id, ...updateFields }: any) =>
      JobModel.findByIdAndUpdate(
        _id,
        updateFields,
        { new: true }
      ),

    deleteJob: async (_: any, { _id }: { _id: string }) =>
      JobModel.findByIdAndDelete(_id)
  }
};