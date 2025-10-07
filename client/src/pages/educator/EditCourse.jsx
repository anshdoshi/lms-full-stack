import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import Quill from 'quill';
import uniqid from 'uniqid';
import { AppContext } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { educatorAPI } from '../../utils/api';
import Loading from '../../components/student/Loading';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { currency } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    videoType: 'youtube', // 'youtube' or 'upload'
    videoFile: null,
    isPreviewFree: false,
  });
  const [videoFiles, setVideoFiles] = useState({});
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Fetch course data
  const fetchCourseData = async () => {
    try {
      const { data } = await educatorAPI.getCourseById(id);

      if (data.success) {
        const course = data.course;
        setCourseTitle(course.courseTitle);
        setCoursePrice(course.coursePrice);
        setDiscount(course.discount);
        setExistingImage(course.courseThumbnail);
        setChapters(course.courseContent || []);

        // Set Quill content
        if (quillRef.current) {
          quillRef.current.root.innerHTML = course.courseDescription;
        }

        setLoading(false);
      } else {
        toast.error(data.message);
        navigate('/educator/my-courses');
      }
    } catch (error) {
      toast.error(error.message);
      navigate('/educator/my-courses');
    }
  };

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    // Validate lecture details
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (lectureDetails.videoType === 'youtube' && !lectureDetails.lectureUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (lectureDetails.videoType === 'upload' && !lectureDetails.videoFile) {
      toast.error('Please select a video file');
      return;
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            lectureTitle: lectureDetails.lectureTitle,
            lectureDuration: lectureDetails.lectureDuration,
            lectureUrl: lectureDetails.lectureUrl,
            videoType: lectureDetails.videoType,
            videoFile: lectureDetails.videoFile,
            isPreviewFree: lectureDetails.isPreviewFree,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      videoType: 'youtube',
      videoFile: null,
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Check if any lectures have video files to upload
      const hasVideoUploads = chapters.some(chapter =>
        chapter.chapterContent.some(lecture => lecture.videoType === 'upload' && lecture.videoFile)
      );

      if (hasVideoUploads) {
        setUploadingVideo(true);
        toast.info('Uploading videos... This may take a few minutes.');
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters.map(chapter => ({
          ...chapter,
          chapterContent: chapter.chapterContent.map(lecture => ({
            lectureId: lecture.lectureId,
            lectureTitle: lecture.lectureTitle,
            lectureDuration: lecture.lectureDuration,
            lectureUrl: lecture.lectureUrl,
            videoType: lecture.videoType,
            isPreviewFree: lecture.isPreviewFree,
            lectureOrder: lecture.lectureOrder
          }))
        })),
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      
      // Only append image if a new one is selected
      if (image) {
        formData.append('image', image);
      }

      // Append video files
      chapters.forEach((chapter) => {
        chapter.chapterContent.forEach((lecture) => {
          if (lecture.videoType === 'upload' && lecture.videoFile) {
            formData.append(`video_${chapter.chapterId}_${lecture.lectureId}`, lecture.videoFile);
          }
        });
      });

      const { data } = await educatorAPI.updateCourse(id, formData);

      setUploadingVideo(false);

      if (data.success) {
        toast.success(data.message);
        navigate('/educator/my-courses');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setUploadingVideo(false);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchCourseData();
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full mb-4">
        <button
          onClick={() => navigate('/educator/my-courses')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <img src={assets.arrow_icon} alt="back" className="w-4 rotate-180" />
          <span>Back to My Courses</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Edit Course</h2>

        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
              required
            />
          </div>

          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img src={assets.file_upload_icon} alt="" className="p-3 bg-blue-500 rounded cursor-pointer" />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              <img
                className="max-h-10"
                src={image ? URL.createObjectURL(image) : existingImage}
                alt="thumbnail"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Adding Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId || chapterIndex} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && '-rotate-90'} `}
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1} {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-gray-500">{chapter.chapterContent.length} Lectures</span>
                <img
                  onClick={() => handleChapter('remove', chapter.chapterId)}
                  src={assets.cross_icon}
                  alt=""
                  className="cursor-pointer"
                />
              </div>
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lecture.lectureId || lectureIndex} className="flex justify-between items-center mb-2">
                      <span>
                        {lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - 
                        {lecture.videoType === 'youtube' || !lecture.videoType ? (
                          <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">YouTube</a>
                        ) : (
                          <span className="text-green-600 ml-1">📹 Video File</span>
                        )}
                        {' '}- {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                      <img
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                        src={assets.cross_icon}
                        alt=""
                        className="cursor-pointer"
                      />
                    </div>
                  ))}
                  <div
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}
          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white text-gray-700 p-6 rounded relative w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                
                <div className="mb-3">
                  <p className="mb-1">Lecture Title *</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-2 px-3"
                    placeholder="Enter lecture title"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <p className="mb-1">Duration (minutes) *</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-2 px-3"
                    placeholder="Enter duration"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <p className="mb-2">Video Source *</p>
                  <div className="flex gap-4 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoType"
                        value="youtube"
                        checked={lectureDetails.videoType === 'youtube'}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, videoType: e.target.value, videoFile: null })}
                        className="scale-125"
                      />
                      <span>YouTube URL</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="videoType"
                        value="upload"
                        checked={lectureDetails.videoType === 'upload'}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, videoType: e.target.value, lectureUrl: '' })}
                        className="scale-125"
                      />
                      <span>Upload Video</span>
                    </label>
                  </div>

                  {lectureDetails.videoType === 'youtube' ? (
                    <div>
                      <input
                        type="text"
                        className="mt-1 block w-full border rounded py-2 px-3"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={lectureDetails.lectureUrl}
                        onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter full YouTube URL</p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/webm"
                        className="mt-1 block w-full border rounded py-2 px-3"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            // Check file size (100MB limit)
                            if (file.size > 100 * 1024 * 1024) {
                              toast.error('Video file size must be less than 100MB');
                              e.target.value = '';
                              return;
                            }
                            setLectureDetails({ ...lectureDetails, videoFile: file });
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: MP4, MOV, AVI, WebM (Max 100MB)
                      </p>
                      {lectureDetails.videoFile && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ {lectureDetails.videoFile.name} ({(lectureDetails.videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 my-4">
                  <input
                    type="checkbox"
                    id="isPreviewFree"
                    className='scale-125'
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                  <label htmlFor="isPreviewFree" className="cursor-pointer">Is Preview Free?</label>
                </div>

                <button 
                  type='button' 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors" 
                  onClick={addLecture}
                >
                  Add Lecture
                </button>
                <img 
                  onClick={() => {
                    setShowPopup(false);
                    setLectureDetails({
                      lectureTitle: '',
                      lectureDuration: '',
                      lectureUrl: '',
                      videoType: 'youtube',
                      videoFile: null,
                      isPreviewFree: false,
                    });
                  }} 
                  src={assets.cross_icon} 
                  className='absolute top-4 right-4 w-4 cursor-pointer' 
                  alt="" 
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white w-max py-2.5 px-8 rounded my-4 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={uploadingVideo}
          >
            {uploadingVideo ? 'Uploading Videos...' : 'Update Course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/educator/my-courses')}
            className="bg-gray-400 text-white w-max py-2.5 px-8 rounded my-4 hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
        {uploadingVideo && (
          <p className="text-sm text-blue-600 mb-4">
            ⏳ Please wait while videos are being uploaded. This may take several minutes depending on file sizes.
          </p>
        )}
      </form>
    </div>
  );
};

export default EditCourse;
