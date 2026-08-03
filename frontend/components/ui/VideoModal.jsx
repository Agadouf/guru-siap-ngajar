export default function VideoModal({
  video,
  onClose,
}) {
  if (!video) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-[900px] max-w-[95%]"
      >

        <video
          src={video}
          controls
          autoPlay
          className="w-full rounded-xl"
        />

        <div className="flex justify-end mt-5">

          <button
            onClick={onClose}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}