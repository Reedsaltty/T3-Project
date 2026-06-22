import { useState, useRef } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  GripVertical, 
  Plus, 
  Trash2 
} from "lucide-react";

// Muted Green Theme Colors (Matching VenueSelection)
const colors = {
  primary: "#1F4D3F",
  secondary: "#5A7A6B",
  background: "#F5F5F0",
  text: "#1F2937",
  border: "#D1D5DB",
  error: "#EF4444",
  white: "#FFFFFF"
};

export default function TimeAndTask({ onNext, onBack }) {
  const [activities, setActivities] = useState([
    { id: "1", time: "18:00", name: "Guest Arrival & Welcome Drinks" },
    { id: "2", time: "19:00", name: "Dinner Service Starts" }
  ]);

  const [newTime, setNewTime] = useState("");
  const [newName, setNewName] = useState("");
  
  // Tracking dragging state
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Errors for input and progression
  const [inputError, setInputError] = useState("");
  const [progressionError, setProgressionError] = useState("");

  const MAX_NAME_LENGTH = 40;

  // Add new activity handler
  const handleAddActivity = () => {
    if (!newTime || !newName) {
      setInputError("Both Time and Activity Name are required.");
      return;
    }

    const newActivity = {
      id: Date.now().toString(),
      time: newTime,
      name: newName
    };

    setActivities([...activities, newActivity]);
    setNewTime("");
    setNewName("");
    setInputError("");
    setProgressionError("");
  };

  // Delete activity handler
  const handleDeleteActivity = (id) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  // Native HTML5 Drag and Drop handlers
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    // Optional: make it slightly transparent while dragging
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      e.target.style.opacity = "0.5";
    }, 0);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault(); // Necessary to allow dropping
    dragOverItem.current = index;
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    // Duplicate the current list
    const _activities = [...activities];
    // Remove the dragged item
    const draggedItemContent = _activities.splice(dragItem.current, 1)[0];
    // Insert it at the new position
    _activities.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Reset refs and update state
    dragItem.current = null;
    dragOverItem.current = null;
    setActivities(_activities);
  };

  const handleNext = () => {
    if (activities.length === 0) {
      setProgressionError("⚠️ Please add at least one activity to your itinerary before finishing.");
      return;
    }
    // Successfully proceed
    onNext(activities);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b" style={{ borderColor: colors.border, backgroundColor: colors.white }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-semibold" style={{ color: colors.primary }}>
              Step 3 of 3
            </span>
            <div className="flex gap-2">
              <div className="h-1 w-12 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="h-1 w-12 rounded-full" style={{ backgroundColor: colors.primary }} />
              <div className="h-1 w-12 rounded-full" style={{ backgroundColor: colors.primary }} />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text }}>
            Itinerary & Activities
          </h1>
          <p className="text-sm" style={{ color: colors.secondary }}>
            Build your event schedule. Drag and drop items to reorder them to your liking.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* Input Form Section */}
        <div className="p-6 rounded-xl border mb-8" style={{ backgroundColor: colors.white, borderColor: colors.border }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>Add New Activity</h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-semibold mb-2" style={{ color: colors.text }}>Time</label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.secondary }} />
                <input 
                  type="time" 
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border outline-none"
                  style={{ borderColor: colors.border, color: colors.text }}
                  onFocus={(e) => e.target.style.borderColor = colors.primary}
                  onBlur={(e) => e.target.style.borderColor = colors.border}
                />
              </div>
            </div>

            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold" style={{ color: colors.text }}>Activity Name</label>
                <span className="text-xs" style={{ color: newName.length >= MAX_NAME_LENGTH ? colors.error : colors.secondary }}>
                  {newName.length}/{MAX_NAME_LENGTH}
                </span>
              </div>
              <input 
                type="text" 
                placeholder="e.g. Cake Cutting"
                maxLength={MAX_NAME_LENGTH}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border outline-none"
                style={{ 
                  borderColor: newName.length >= MAX_NAME_LENGTH ? colors.error : colors.border, 
                  color: colors.text,
                  boxShadow: newName.length >= MAX_NAME_LENGTH ? `0 0 0 1px ${colors.error}` : "none"
                }}
                onFocus={(e) => { if(newName.length < MAX_NAME_LENGTH) e.target.style.borderColor = colors.primary; }}
                onBlur={(e) => e.target.style.borderColor = newName.length >= MAX_NAME_LENGTH ? colors.error : colors.border}
              />
              {newName.length >= MAX_NAME_LENGTH && (
                <p className="text-xs mt-1" style={{ color: colors.error }}>Maximum character limit reached.</p>
              )}
            </div>
          </div>

          {inputError && (
            <p className="text-sm mt-4 font-semibold" style={{ color: colors.error }}>
              {inputError}
            </p>
          )}

          <button 
            onClick={handleAddActivity}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: colors.background, color: colors.primary, border: `1px solid ${colors.primary}` }}
          >
            <Plus size={18} />
            Add to Itinerary
          </button>
        </div>

        {/* Draggable Activities List */}
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Your Itinerary</h2>
        
        {activities.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed" style={{ borderColor: colors.border, backgroundColor: 'transparent' }}>
            <p className="text-sm" style={{ color: colors.secondary }}>Your itinerary is empty. Add some activities above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div 
                key={activity.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="flex items-center gap-4 p-4 rounded-xl border group transition-all"
                style={{ 
                  backgroundColor: colors.white, 
                  borderColor: colors.border,
                  cursor: 'grab'
                }}
              >
                <div style={{ color: colors.secondary }} className="hover:text-black cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>
                <div className="font-bold w-16 shrink-0" style={{ color: colors.primary }}>
                  {activity.time}
                </div>
                <div className="flex-1 font-medium truncate" style={{ color: colors.text }}>
                  {activity.name}
                </div>
                <button 
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                  style={{ color: colors.error, backgroundColor: "#FEE2E2" }}
                  title="Remove activity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons & Guardrails */}
        <div className="flex flex-col gap-4 pt-10 mt-10 border-t" style={{ borderColor: colors.border }}>
          {progressionError && (
            <div className="p-3 rounded-lg flex items-center justify-center font-semibold text-sm animate-pulse" 
                 style={{ backgroundColor: "#FEE2E2", color: colors.error }}>
              {progressionError}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: colors.background,
                color: colors.primary,
                border: `2px solid ${colors.primary}`
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#E6F2FF"}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.background}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ml-auto"
              style={{
                backgroundColor: colors.primary,
                color: colors.white
              }}
              onMouseEnter={(e) => { e.target.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.target.style.opacity = "1"; }}
            >
              Finish Event
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
