import { ChapterClass, ChapterModel } from "../models/chapter.model";

export const createChapterService = async (data: Partial<ChapterClass>) => {
  const chapter = new ChapterModel(data);
  return await chapter.save();
};

export const getChapterService = async (id: string) => {
  return await ChapterModel.findOne({ _id: id }).exec();
};
