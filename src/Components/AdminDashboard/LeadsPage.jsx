import React, { useState, useEffect, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useDroppable } from "@dnd-kit/core";
import * as XLSX from "xlsx";

import {
  MoreVertical,
  Edit2,
  Trash2,
  Send,
  Voicemail,
  Building2,
  History,
  Plus,
  BarChart2,
  List,
  Clock,
  Filter,
  Edit,
  GripVertical,
  X,
  Download,
  Search,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://crm-bcgg.onrender.com";

const statuses = [
  {
    id: "new",
    title: "New",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "contacted",
    title: "Contacted",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "interested",
    title: "Interested",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    id: "not interested",
    title: "Not Interested",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    id: "converted",
    title: "Converted",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  {
    id: "lost",
    title: "Lost",
    color: "bg-red-100 text-red-800 border-red-200",
  },
];

const LeadsPage = () => {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [builders, setBuilders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showDealForm, setShowDealForm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [newLead, setNewLead] = useState({
    email: "",
    phone: "",
    status: "new",
    source: "website",
    interestedIn: {
      builder: null,
      project: null,
      unit: null,
    },
    user: "",
    notes: [],
    createdAt: "",
  });
  const [editingLeadIndex, setEditingLeadIndex] = useState(null);
  const [actionMenuIndex, setActionMenuIndex] = useState(null);
  const actionMenuRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("logindata"))?.token;
    setToken(token);
    const fetchData = async () => {
      try {
        const [leadsResponse, usersResponse, builderRes, unitRes] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/leads/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/api/users/`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${BASE_URL}/api/properties/builder-profile`),
            axios.get(`${BASE_URL}/api/properties/units`),
          ]);

        setLeads(leadsResponse.data);
        setFilteredLeads(leadsResponse.data);
        setUsers(usersResponse.data);
        setBuilders(builderRes.data);
        setUnits(unitRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = leads.filter(lead => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        (lead.userName && lead.userName.toLowerCase().includes(searchLower)) ||
        (lead.userEmail && lead.userEmail.toLowerCase().includes(searchLower)) ||
        (lead.userPhone && lead.userPhone.includes(searchTerm)) ||
        (lead.notes && lead.notes.some(note => 
          note.note && note.note.toLowerCase().includes(searchLower)
        )) ||
        (lead.status && lead.status.toLowerCase().includes(searchLower)) ||
        (lead.source && lead.source.toLowerCase().includes(searchLower))
      );
    });
    setFilteredLeads(filtered);
  }, [searchTerm, leads]);

  const handleInterestedInChange = async (e) => {
    const { name, value } = e.target;

    if (name === "builder") {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/properties/projects/by-builder/${value}`
        );
        setProjects(res.data);
        setNewLead((prev) => ({
          ...prev,
          interestedIn: {
            ...prev.interestedIn,
            builder: value,
            project: "",
            unit: "",
          },
        }));
      } catch (err) {
        console.error("Error fetching projects", err);
      }
    } else {
      setNewLead((prev) => ({
        ...prev,
        interestedIn: {
          ...prev.interestedIn,
          [name]: value,
        },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleNoteChange = (e) => {
    const note = e.target.value;
    setNewLead((prev) => ({
      ...prev,
      notes: note
        ? [
            {
              note,
              date: new Date().toISOString().split("T")[0],
              addedBy: null,
            },
          ]
        : [],
    }));
  };

  const getUserName = (userId) => {
    if (!userId) return "Unassigned";
    const user = users.find((u) => u._id === userId);
    return user ? user.name : "Unassigned";
  };

  const handleSaveLead = async () => {
    if (!newLead.email || !newLead.phone) {
      alert("Email and Phone are required.");
      return;
    }

    try {
      const selectedUser = users.find((user) => user._id === newLead.user);
      const userName = selectedUser ? selectedUser.name : "";

      const payload = {
        ...newLead,
        userName,
        userPhone: newLead.phone,
        userEmail: newLead.email,
        notes:
          newLead.notes.length > 0
            ? newLead.notes
            : [
                {
                  note: "Initial contact",
                  date: new Date().toISOString().split("T")[0],
                  addedBy: null,
                },
              ],
        createdAt: newLead.createdAt || new Date().toISOString().split("T")[0],
      };

      if (editingLeadIndex !== null) {
        const leadToUpdate = leads[editingLeadIndex];
        const response = await axios.put(
          `${BASE_URL}/api/leads/${leadToUpdate._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedLeads = leads.map((lead, index) =>
          index === editingLeadIndex ? response.data : lead
        );
        setLeads(updatedLeads);
      } else {
        const response = await axios.post(`${BASE_URL}/api/leads/`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeads([...leads, response.data]);
      }

      resetForm();
      setShowDealForm(false);
      setEditingLeadIndex(null);
    } catch (error) {
      console.error("Failed to save lead:", error);
      alert("Failed to save lead. Please try again.");
    }
  };

  const handleEditLead = (index) => {
    const leadToEdit = filteredLeads[index];
    const originalIndex = leads.findIndex(lead => lead._id === leadToEdit._id);
    
    setNewLead({
      email: leadToEdit.email,
      phone: leadToEdit.phone,
      status: leadToEdit.status,
      source: leadToEdit.source,
      interestedIn: leadToEdit.interestedIn || {
        builder: null,
        project: null,
        unit: null,
      },
      user: leadToEdit.user,
      notes: leadToEdit.notes || [],
      createdAt: leadToEdit.createdAt,
    });
    setEditingLeadIndex(originalIndex);
    setShowDealForm(true);
    setActionMenuIndex(null);
  };

  const handleDeleteLead = async (index) => {
    const leadToDelete = filteredLeads[index];
    const originalIndex = leads.findIndex(lead => lead._id === leadToDelete._id);
    
    try {
      await axios.delete(`${BASE_URL}/api/leads/${leadToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLeads(leads.filter((_, i) => i !== originalIndex));
      setActionMenuIndex(null);
    } catch (error) {
      console.error("Failed to delete lead:", error);
      alert("Failed to delete lead. Please try again.");
    }
  };

  const resetForm = () => {
    setNewLead({
      email: "",
      phone: "",
      status: "new",
      source: "website",
      interestedIn: {
        builder: null,
        project: null,
        unit: null,
      },
      user: "",
      notes: [],
      createdAt: "",
    });
  };

  function DroppablePlaceholder({ id }) {
    const { setNodeRef } = useDroppable({
      id,
      data: {
        dropzoneFor: id,
      },
    });

    return (
      <div
        ref={setNodeRef}
        className="h-16 border-2 border-dashed border-gray-300 rounded-lg mb-3"
      />
    );
  }

  const findContainer = (id) => {
    const directStatus = statuses.find(status => status.id === id);
    if (directStatus) return directStatus.id;

    const lead = filteredLeads.find(lead => lead._id === id);
    if (lead) return lead.status;

    return null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    let overContainer = findContainer(over.id);

    if (!overContainer) {
      if (over.data.current?.dropzoneFor) {
        overContainer = over.data.current.dropzoneFor;
      }
      else if (over.data.current?.sortable?.containerId) {
        overContainer = over.data.current.sortable.containerId;
      }
      else if (statuses.some(status => status.id === over.id)) {
        overContainer = over.id;
      }
    }

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setFilteredLeads(prev => 
      prev.map(lead => 
        lead._id === active.id ? { ...lead, status: overContainer } : lead
      )
    );
  };

  const handleDragEnd = async (event) => {
    const { active } = event;
    const leadId = active.id;
    const newStatus = findContainer(leadId);

    try {
      const leadIndex = leads.findIndex(lead => lead._id === leadId);
      if (leadIndex === -1 || !newStatus) return;

      const updatedLead = { ...leads[leadIndex], status: newStatus };
      
      const response = await axios.put(
        `${BASE_URL}/api/leads/${leadId}`,
        updatedLead,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLeads(prev => 
        prev.map(lead => lead._id === leadId ? response.data : lead)
      );
    } catch (error) {
      console.error("Failed to update lead status:", error);
      setFilteredLeads([...leads]);
    } finally {
      setActiveId(null);
    }
  };

  const handleDownload = async () => {
    toast.success("Download started successfully");

    try {
      const response = await fetch(`${BASE_URL}/api/leads/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      const transformedData = data.map((item) => {
        const newItem = { ...item };
        delete newItem._id;
        delete newItem.user;

        if (newItem.assignedTo) {
          newItem.assignedToName = newItem.assignedTo.name;
          delete newItem.assignedTo;
        }

        return newItem;
      });

      const worksheet = XLSX.utils.json_to_sheet(transformedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

      XLSX.writeFile(workbook, "leads_data.xlsx");
    } catch (error) {
      console.error("Error downloading data:", error);
      toast.error("Failed to download data");
    }
  };

  const getLeadsByStatus = (statusId) => {
    return filteredLeads.filter((lead) => lead.status === statusId);
  };

  const getStatusColor = (statusId) => {
    const status = statuses.find((s) => s.id === statusId);
    return status ? status.color : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const activeLead = activeId ? filteredLeads.find((d) => d._id === activeId) : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  function LeadCard({
    lead,
    listeners,
    attributes,
    setNodeRef,
    transform,
    transition,
    dragging,
  }) {
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: dragging ? 0.5 : 1,
    };

    const statusColor = getStatusColor(lead.status);

    const stopDrag = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        style={style}
        className="bg-white rounded-xl shadow p-3 mb-3 border border-gray-200 cursor-move relative"
      >
        <div className="absolute top-2 right-2">
          <button
            onMouseDown={stopDrag}
            onClick={(e) => {
              e.stopPropagation();
              setActionMenuIndex(
                lead._id === actionMenuIndex ? null : lead._id
              );
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreVertical size={16} />
          </button>

          {actionMenuIndex === lead._id && (
            <div ref={actionMenuRef} className="absolute right-0 mt-2 w-15 bg-white border rounded-lg shadow z-10">
              <button
                onClick={() => {
                  const index = filteredLeads.findIndex(l => l._id === lead._id);
                  handleEditLead(index);
                }}
                className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100"
              >
                <Edit2 size={16} /> 
              </button>
              <button
                onClick={() => {
                  const index = filteredLeads.findIndex(l => l._id === lead._id);
                  handleDeleteLead(index);
                }}
                className="w-full px-4 py-2 text-sm text-red-600 flex items-center gap-2 hover:bg-gray-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-2" {...listeners}>
          <div>
            <h3 className="text-sm font-medium">
              {lead.userName || "Unnamed Lead"}
            </h3>
            <p className="text-xs text-gray-500 capitalize">{lead.source}</p>
          </div>
        </div>

        <div className="text-xs text-gray-600 space-y-1">
          <p className="flex items-center gap-1 truncate">
            <Send size={12} /> {lead.userEmail}
          </p>
          <p className="flex items-center gap-1">
            <Voicemail size={12} /> {lead.userPhone}
          </p>
          <p className="flex items-center gap-1 truncate">
            <Building2 size={12} />
            {lead.notes.length > 0 ? lead.notes[0].note : "No notes"}
          </p>
          <p className="flex items-center gap-1">
            Assigned: {getUserName(lead.user)}
          </p>
        </div>

        <p
          className={`text-xs mt-2 px-2 py-0.5 rounded inline-block ${statusColor}`}
        >
          Status:{" "}
          {statuses.find((s) => s.id === lead.status)?.title || lead.status}
        </p>
      </div>
    );
  }

  function SortableLead({ lead }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: lead._id });

    return (
      <LeadCard
        lead={lead}
        listeners={listeners}
        attributes={attributes}
        setNodeRef={setNodeRef}
        transform={transform}
        transition={transition}
        dragging={isDragging}
      />
    );
  }

  function Column({ status }) {
    const leadsInStatus = getLeadsByStatus(status.id);
    return (
      <div 
        className="bg-gray-50 rounded-xl p-4 shadow border border-gray-200 min-h-[200px]"
        data-dropzone-for={status.id}
        {...{
          "data-dnd-kit-dropzone-for": status.id,
        }}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-700">{status.title}</h2>
          <span className="text-sm text-gray-500">{leadsInStatus.length}</span>
        </div>

        <SortableContext 
          items={leadsInStatus.map(l => l._id)} 
          strategy={rectSortingStrategy}
        >
          <div className="min-h-[100px] max-h-[500px] overflow-y-auto">
            {leadsInStatus.length > 0 ? (
              leadsInStatus.map(lead => (
                <SortableLead key={lead._id} lead={lead} />
              ))
            ) : (
              <DroppablePlaceholder id={status.id} />
            )}
          </div>
        </SortableContext>

        <button
          onClick={() => {
            resetForm();
            setNewLead(prev => ({ ...prev, status: status.id }));
            setShowDealForm(true);
          }}
          className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-1"
        >
          <Plus size={16} /> Add lead
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-sm">
        <div className="flex border rounded-md overflow-hidden">
          <button className="p-2 border-r hover:bg-gray-200">
            <BarChart2 size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => navigate("/leadspage/list")}
            className="p-2 border-r hover:bg-gray-200"
          >
            <List size={18} className="text-gray-600" />
          </button>
          <Toaster />
          <button onClick={handleDownload} className="p-2 hover:bg-gray-200">
            <Download size={18} className="text-gray-600" />
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search leads..."
            className="p-2 pl-8 w-96 focus:outline-none border border-gray-300 rounded"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <Search size={18} className="absolute left-2 top-3 text-gray-400" />
        </div>

        <div className="flex items-center gap-4">
          <div className="font-semibold text-gray-800">
            {filteredLeads.filter((lead) =>
              lead.status?.toLowerCase?.() !== "lost"
            ).length} leads
          </div>

          {/* <div className="flex border rounded-md overflow-hidden">
            <button className="p-2 border-r hover:bg-gray-200">
              <Filter size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200">
              <Edit size={18} className="text-gray-600" />
            </button>
          </div> */}

          <button
            onClick={() => {
              resetForm();
              setShowDealForm(true);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} /> Lead
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {statuses.slice(0, 5).map((status) => (
            <Column key={status.id} status={status} />
          ))}
        </div>

        <DragOverlay>
          {activeLead && <LeadCard lead={activeLead} dragging />}
        </DragOverlay>
      </DndContext>

      {showDealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingLeadIndex !== null ? "Edit Lead" : "Add New Lead"}
              </h2>
              <button
                onClick={() => {
                  setShowDealForm(false);
                  setEditingLeadIndex(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  value={newLead.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-2 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={newLead.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border p-2 rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newLead.status}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="source">
                  Source
                </label>
                <select
                  id="source"
                  name="source"
                  value={newLead.source}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="walk-in">Walk-in</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="user">
                  Assigned To
                </label>
                <select
                  id="user"
                  name="user"
                  value={newLead.user}
                  onChange={handleChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="builder">
                  Interested in Builder
                </label>
                <select
                  id="builder"
                  name="builder"
                  value={newLead.interestedIn.builder || ""}
                  onChange={handleInterestedInChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select Builder</option>
                  {builders.map((builder) => (
                    <option key={builder._id} value={builder._id}>
                      {builder.companyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="project">
                  Interested in Project
                </label>
                <select
                  id="project"
                  name="project"
                  value={newLead.interestedIn.project || ""}
                  onChange={handleInterestedInChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="unit">
                  Interested in Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={newLead.interestedIn.unit || ""}
                  onChange={handleInterestedInChange}
                  className="border p-2 rounded"
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit._id} value={unit._id}>
                      {unit.propertyType} - {unit.bhkType}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium" htmlFor="notes">
                  Notes
                </label>
                <input
                  id="notes"
                  name="notes"
                  value={newLead.notes.length > 0 ? newLead.notes[0].note : ""}
                  onChange={handleNoteChange}
                  placeholder="Initial note"
                  className="border p-2 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowDealForm(false);
                  setEditingLeadIndex(null);
                }}
                className="mr-2 px-4 py-2 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLead}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;