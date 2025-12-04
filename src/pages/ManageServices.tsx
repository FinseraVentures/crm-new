import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/Pagination";
import { Search, Edit, Trash2, Power, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

interface Service {
  id: string;
  name: string;
  category: string;
  processingTime: string;
  serviceType: string;
  status: boolean;
  description: string;
}

export default function ManageServices() {
  // Add Service State
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    processingTime: "",
    serviceType: "",
    status: true,
    description: "",
  });

  // Services List State
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Private Limited Company Registration",
      category: "Registration",
      processingTime: "7-10 days",
      serviceType: "One-time",
      status: true,
      description: "Complete registration of Private Limited Company with MCA",
    },{
    "id": "2",
    "name": "LLP Registration",
    "category": "Registration",
    "processingTime": "5-7 days",
    "serviceType": "One-time",
    "status": true,
    "description": "Complete registration of Limited Liability Partnership with MCA"
  },
  {
    "id": "3",
    "name": "GST Registration",
    "category": "Tax & Compliance",
    "processingTime": "1-2 days",
    "serviceType": "One-time",
    "status": true,
    "description": "Apply for new GST Registration for businesses and individuals"
  },
  {
    "id": "4",
    "name": "MSME (Udyam) Registration",
    "category": "Certification",
    "processingTime": "Same day",
    "serviceType": "One-time",
    "status": true,
    "description": "Register your business under MSME Udyam scheme"
  },
  {
    "id": "5",
    "name": "Trademark Registration",
    "category": "Intellectual Property",
    "processingTime": "24-48 hours (filing)",
    "serviceType": "One-time",
    "status": true,
    "description": "Trademark application filing and documentation support"
  },
  {
    "id": "6",
    "name": "ISO Certification",
    "category": "Certification",
    "processingTime": "5-10 days",
    "serviceType": "One-time",
    "status": true,
    "description": "ISO 9001, 14001, 22000 certification support for businesses"
  },
  {
    "id": "7",
    "name": "GST Return Filing",
    "category": "Tax & Compliance",
    "processingTime": "1-2 days",
    "serviceType": "Monthly",
    "status": true,
    "description": "Monthly GST filing service including GSTR-1 and GSTR-3B"
  },
  {
    "id": "8",
    "name": "Annual Compliance - Private Limited",
    "category": "Compliance",
    "processingTime": "15-20 days",
    "serviceType": "Yearly",
    "status": true,
    "description": "Complete annual ROC filings and financial compliance"
  },
  {
    "id": "9",
    "name": "Income Tax Return (ITR) Filing",
    "category": "Tax & Compliance",
    "processingTime": "1-2 days",
    "serviceType": "Yearly",
    "status": true,
    "description": "Professional assistance in filing Income Tax Returns for individuals & businesses"
  },
  {
    "id": "10",
    "name": "Startup India Certificate",
    "category": "Certification",
    "processingTime": "7-12 days",
    "serviceType": "One-time",
    "status": true,
    "description": "Support in applying for Startup India recognition certificate"
  },
  {
    "id": "11",
    "name": "Company Name Change (MCA)",
    "category": "Company Update",
    "processingTime": "5-7 days",
    "serviceType": "One-time",
    "status": true,
    "description": "Assistance with company name change process under MCA"
  },
    {
      id: "2",
      name: "GST Registration",
      category: "Compliance",
      processingTime: "3-5 days",
      serviceType: "One-time",
      status: true,
      description: "GST registration for businesses",
    },
    {
      id: "3",
      name: "Annual Compliance Package",
      category: "Compliance",
      processingTime: "Ongoing",
      serviceType: "Recurring",
      status: true,
      description: "Complete annual compliance services",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Edit Service State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Delete Service State
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Add Service Handler
  const handleAddService = () => {
    if (!newService.name || !newService.category || !newService.processingTime || !newService.serviceType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const service: Service = {
      id: Date.now().toString(),
      ...newService,
    };

    setServices([...services, service]);
    setNewService({
      name: "",
      category: "",
      processingTime: "",
      serviceType: "",
      status: true,
      description: "",
    });
    setCurrentPage(1);
    toast.success("Service added successfully");
  };

  // Edit Service Handlers
  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingService) return;
    setServices(services.map((service) => (service.id === editingService.id ? editingService : service)));
    setEditDialogOpen(false);
    setEditingService(null);
    toast.success("Service updated successfully");
  };

  // Toggle Status Handler
  const handleToggleStatus = (id: string) => {
    setServices(
      services.map((service) => {
        if (service.id === id) {
          const newStatus = !service.status;
          toast.success(`Service ${newStatus ? "enabled" : "disabled"} successfully`);
          return { ...service, status: newStatus };
        }
        return service;
      })
    );
  };

  // Delete Service Handlers
  const handleDeleteService = (id: string) => {
    setDeletingServiceId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingServiceId) {
      setServices(services.filter((service) => service.id !== deletingServiceId));
      toast.success("Service deleted successfully");
    }
    setDeleteDialogOpen(false);
    setDeletingServiceId(null);
  };

  // Filter services based on search
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.processingTime.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Manage Services" },
          ]}
        />

        {/* Add Service Section */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">
            Add Service
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-6">
            Create and manage services available in the CRM.
          </p>

              <Card>
            <CardContent className="pt-2 md:pt-2 px-3 md:px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs md:text-sm">Service Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter service name"
                    value={newService.name}
                    className="w-full"
                    onChange={(e) =>
                      setNewService({ ...newService, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="category" className="text-xs md:text-sm">Category</Label>
                  <Select
                    value={newService.category}
                    onValueChange={(value) =>
                      setNewService({ ...newService, category: value })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Registration">Registration</SelectItem>
                      <SelectItem value="Funding">Funding</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Certification">
                        Certification
                      </SelectItem>
                      <SelectItem value="Licensing">Licensing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="processingTime" className="text-xs md:text-sm">
                    Processing Time
                  </Label>
                  <Input
                    id="processingTime"
                    placeholder="e.g., 7–10 days"
                    value={newService.processingTime}
                    className="w-full"
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        processingTime: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="serviceType" className="text-xs md:text-sm">Service Type</Label>
                  <Select
                    value={newService.serviceType}
                    onValueChange={(value) =>
                      setNewService({ ...newService, serviceType: value })
                    }
                  >
                    <SelectTrigger id="serviceType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-time">One-time</SelectItem>
                      <SelectItem value="Recurring">Recurring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="status" className="text-xs md:text-sm">Status</Label>
                  <div className="flex items-center space-x-2 h-10">
                    <Switch
                      id="status"
                      checked={newService.status}
                      onCheckedChange={(checked) =>
                        setNewService({ ...newService, status: checked })
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {newService.status ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 lg:col-span-2 xl:col-span-3">
                  <Label htmlFor="description" className="text-xs md:text-sm">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter service description"
                      value={newService.description}
                      className="w-full resize-none"
                    onChange={(e) =>
                      setNewService({
                        ...newService,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end mt-3 gap-2">
                <Button
                  onClick={handleAddService}
                  className="rounded-full px-6 w-full sm:w-auto text-sm"
                >
                  Add Service
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2">
            Services List
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-6">
            View, edit, enable/disable or delete services from the CRM.
          </p>

          <Card>
            <CardHeader>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services by name or category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile + tablet: stacked service cards to avoid horizontal scroll */}
              <div className="xl:hidden space-y-3">
                {filteredServices.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No services found.</div>
                  ) : (
                    paginatedServices.map((service, index) => (
                      <div key={service.id} className="bg-card border border-border rounded-lg p-2 shadow-sm">
                        <div className="flex items-start justify-between gap-2 min-w-0">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <div className="font-medium text-sm truncate max-w-[70%]">{service.name}</div>
                              <div className="text-xs text-muted-foreground flex-shrink-0">#{index + 1}</div>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground truncate max-w-full">{service.category} • {service.processingTime}</div>
                            <div className="mt-1 flex items-center gap-1 flex-wrap">
                              <Badge variant="outline" className="text-xs truncate max-w-[65%]">{service.serviceType}</Badge>
                              <span className="text-xs text-muted-foreground truncate">{service.status ? "Enabled" : "Disabled"}</span>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground line-clamp-2 break-words">{service.description}</div>
                          </div>

                          <div className="flex items-start gap-2 flex-shrink-0">
                            <div className="hidden sm:flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditService(service)} className="h-8 w-8" aria-label={`Edit ${service.name}`}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant={service.status ? "outline" : "default"} size="sm" onClick={() => handleToggleStatus(service.id)} className="h-8 w-8">
                                <Power className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)} className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="sm:hidden">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onSelect={() => handleEditService(service)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => handleToggleStatus(service.id)}>{service.status ? "Disable" : "Enable"}</DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => handleDeleteService(service.id)}>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
              </div>

              <div className="hidden xl:block rounded-md border">
                <div className="overflow-x-auto">
                <Table className="min-w-full text-sm table-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">No</TableHead>
                      <TableHead className="max-w-[200px]">Service Name</TableHead>
                      <TableHead className="max-w-[120px]">Category</TableHead>
                      <TableHead className="hidden xl:table-cell max-w-[120px]">Processing Time</TableHead>
                      <TableHead className="text-center max-w-[100px]">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-muted-foreground py-8"
                        >
                          No services found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedServices.map((service, index) => (
                        <TableRow key={service.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="font-medium max-w-[260px] truncate">{service.name}</TableCell>
                          <TableCell className="max-w-[140px]"><Badge variant="outline" className="font-normal truncate max-w-[120px]">{service.category}</Badge></TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground max-w-[140px] truncate">{service.processingTime}</TableCell>
                          <TableCell className="text-center max-w-[100px]">
                            {service.status ? (
                              <Badge className="bg-success hover:bg-success/80">Enabled</Badge>
                            ) : (
                              <Badge variant="secondary">Disabled</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                  <div className="hidden 2xl:flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>
                                      <Edit className="h-4 w-4" />
                                      <span className="ml-1">Edit</span>
                                    </Button>
                                    <Button variant={service.status ? "outline" : "default"} size="sm" onClick={() => handleToggleStatus(service.id)} className={service.status ? "text-warning border-warning hover:bg-warning hover:text-warning-foreground" : "bg-success hover:bg-success/90"}>
                                      <Power className="h-4 w-4" />
                                      <span className="ml-1">{service.status ? "Disable" : "Enable"}</span>
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                                      <Trash2 className="h-4 w-4" />
                                      <span className="ml-1">Delete</span>
                                    </Button>
                                  </div>

                                  <div className="2xl:hidden">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => handleEditService(service)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleToggleStatus(service.id)}>{service.status ? "Disable" : "Enable"}</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleDeleteService(service.id)}>Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                </div>
              </div>

              {/* Pagination */}
              {filteredServices.length > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={filteredServices.length}
                    itemName="service"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Service Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update service information below.
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Service Name</Label>
                <Input
                  id="edit-name"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingService.category}
                  onValueChange={(value) =>
                    setEditingService({
                      ...editingService,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Registration">Registration</SelectItem>
                    <SelectItem value="Funding">Funding</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Licensing">Licensing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-processingTime">Processing Time</Label>
                <Input
                  id="edit-processingTime"
                  value={editingService.processingTime}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      processingTime: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-serviceType">Service Type</Label>
                <Select
                  value={editingService.serviceType}
                  onValueChange={(value) =>
                    setEditingService({
                      ...editingService,
                      serviceType: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-serviceType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="One-time">One-time</SelectItem>
                    <SelectItem value="Recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch
                    id="edit-status"
                    checked={editingService.status}
                    onCheckedChange={(checked) =>
                      setEditingService({
                        ...editingService,
                        status: checked,
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {editingService.status ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              service from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
