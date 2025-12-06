import dummyLessons from "../Lessons/dummyLessons";

const getLessonById = (id) => {
  return dummyLessons.find((lesson) => lesson._id === id);
};

export default getLessonById;
