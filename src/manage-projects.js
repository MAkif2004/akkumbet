import { db } from '../database/connection.js';

let currentEditingProjectId = null;
let currentEditingImages = [];
let draggedElement = null;
let allProjects = [];

// Load and display all projects
async function loadAndDisplayProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Projecten laden...</p>';

    try {
        const { data: projects, error } = await db
            .from('project')
            .select(`
                id,
                title,
                description,
                created_at,
                project_order,
                project_image (
                    id,
                    image_url,
                    position
                )
            `)
            .order('project_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!projects || projects.length === 0) {
            projectsList.innerHTML = `
                <div style="grid-column: 1/-1;">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i class="fas fa-inbox"></i></div>
                        <p class="empty-state-text">Geen projecten gevonden. Maak je eerste project aan!</p>
                    </div>
                </div>
            `;
            return;
        }

        // Store projects for reordering
        allProjects = projects;

        // Sort images by position for each project
        projects.forEach(project => {
            if (project.project_image) {
                project.project_image.sort((a, b) => (a.position || 0) - (b.position || 0));
            }
        });

        // Create project cards with drag handle
        projectsList.innerHTML = projects.map(project => `
            <div class="project-card" data-project-id="${project.id}" draggable="true">
                <div class="drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                ${project.project_image && project.project_image.length > 0 
                    ? `<img src="${project.project_image[0].image_url}" alt="${project.title}" class="project-card-image"/>`
                    : `<div class="project-card-image" style="background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: #999;"><i class="fas fa-image"></i></div>`
                }
                <div class="project-card-content">
                    <h3 class="project-card-title">${project.title}</h3>
                    <p class="project-card-description">${project.description || 'Geen beschrijving'}</p>
                    <div class="project-card-actions">
                        <button class="btn btn-primary btn-sm edit-btn" data-project-id="${project.id}">
                            <i class="fas fa-edit"></i> Bewerk
                        </button>
                        <button class="btn btn-danger btn-sm delete-btn" data-project-id="${project.id}">
                            <i class="fas fa-trash"></i> Verwijder
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add drag and drop listeners
        setupDragAndDrop();

        // Add event listeners
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = e.currentTarget.dataset.projectId;
                editProject(projectId, projects);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = e.currentTarget.dataset.projectId;
                deleteProject(projectId);
            });
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsList.innerHTML = `<p style="color: red;">Error loading projects: ${error.message}</p>`;
    }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedElement = card;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', (e) => {
            card.classList.remove('dragging');
            cards.forEach(c => c.classList.remove('drag-over'));
            draggedElement = null;
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (card !== draggedElement) {
                card.classList.add('drag-over');
            }
        });

        card.addEventListener('dragleave', (e) => {
            card.classList.remove('drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();

            if (card !== draggedElement) {
                // Reorder in DOM
                const projectsList = document.getElementById('projects-list');
                const allCards = Array.from(projectsList.querySelectorAll('.project-card'));
                const draggedIndex = allCards.indexOf(draggedElement);
                const targetIndex = allCards.indexOf(card);

                if (draggedIndex < targetIndex) {
                    card.parentNode.insertBefore(draggedElement, card.nextSibling);
                } else {
                    card.parentNode.insertBefore(draggedElement, card);
                }

                // Update order in database
                updateProjectOrder();
            }

            card.classList.remove('drag-over');
        });
    });
}

// Update project order in database
async function updateProjectOrder() {
    const cards = document.querySelectorAll('.project-card');
    const updates = [];

    cards.forEach((card, index) => {
        const projectId = card.dataset.projectId;
        updates.push({
            id: projectId,
            project_order: index
        });
    });

    try {
        for (const update of updates) {
            await db
                .from('project')
                .update({ project_order: update.project_order })
                .eq('id', update.id);
        }
    } catch (error) {
        console.error('Error updating project order:', error);
        alert('Error updating project order: ' + error.message);
    }
}

// Open modal for adding new project
function openAddProjectModal() {
    currentEditingProjectId = null;
    currentEditingImages = [];
    document.getElementById('modal-title').textContent = 'Nieuw Project';
    document.getElementById('project-form').reset();
    document.getElementById('current-images').innerHTML = '';
    document.getElementById('project-modal').classList.remove('hidden');
}

// Open modal for editing project
async function editProject(projectId, projects) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    currentEditingProjectId = projectId;
    currentEditingImages = [...(project.project_image || [])];

    document.getElementById('modal-title').textContent = 'Project Bewerken';
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('project-images').value = '';

    // Display current images
    displayCurrentImages();

    document.getElementById('project-modal').classList.remove('hidden');
}

// Display current images in edit modal
function displayCurrentImages() {
    const container = document.getElementById('current-images');
    if (currentEditingImages.length === 0) {
        container.innerHTML = '<p style="color: #999; grid-column: 1/-1;">Geen afbeeldingen</p>';
        return;
    }

    container.innerHTML = currentEditingImages
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .map((img, index) => `
            <div class="current-image" data-image-id="${img.id}">
                <img src="${img.image_url}" alt="Project image"/>
                <button type="button" class="remove-image" data-image-id="${img.id}">×</button>
            </div>
        `)
        .join('');

    // Add remove image listeners
    document.querySelectorAll('.remove-image').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const imageId = e.target.dataset.imageId;
            currentEditingImages = currentEditingImages.filter(img => img.id !== imageId);
            displayCurrentImages();
        });
    });
}

// Delete project
async function deleteProject(projectId) {
    if (!confirm('Weet je zeker dat je dit project wilt verwijderen? Dit kan niet ongedaan gemaakt worden.')) {
        return;
    }

    try {
        // Get all images for this project
        const { data: images } = await db
            .from('project_image')
            .select('image_url')
            .eq('project_id', projectId);

        // Delete images from storage
        if (images && images.length > 0) {
            const paths = images.map(img => {
                const url = new URL(img.image_url);
                console.log(url.pathname.split('/project-images/')[1])
                return url.pathname.split('/project-images/')[1];
            });

            if (paths.length > 0) {
                await db.storage.from('project-images').remove(paths);
            }
        }

        // Delete project (project_image rows will cascade delete)
        const { error } = await db
            .from('project')
            .delete()
            .eq('id', projectId);
        if (error) throw error;

        alert('Project verwijderd!');
        loadAndDisplayProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project: ' + error.message);
    }
}

// Save project (create or update)
async function saveProject(e) {
    e.preventDefault();

    const title = document.getElementById('project-title').value.trim();
    const description = document.getElementById('project-description').value.trim();
    const newImages = document.getElementById('project-images').files;

    if (!title) {
        alert('Titel is verplicht');
        return;
    }

    try {
        let projectId = currentEditingProjectId;

        // Create new project if not editing
        if (!projectId) {
            // Get max project_order
            const { data: maxProject } = await db
                .from('project')
                .select('project_order')
                .order('project_order', { ascending: false })
                .limit(1)
                .single();

            const nextOrder = (maxProject?.project_order ?? -1) + 1;

            const { data: project, error } = await db
                .from('project')
                .insert({ title, description, project_order: nextOrder })
                .select()
                .single();

            if (error) throw error;
            projectId = project.id;
        } else {
            // Update existing project
            const { error } = await db
                .from('project')
                .update({ title, description })
                .eq('id', projectId);

            if (error) throw error;

            // Delete removed images (those not in currentEditingImages anymore)
            const existingImageIds = currentEditingImages.map(img => img.id);

            // Get all images currently in database
            const { data: dbImages } = await db
                .from('project_image')
                .select('id, image_url')
                .eq('project_id', projectId);

            if (dbImages) {
                const imagesToDelete = dbImages.filter(img => !existingImageIds.includes(img.id));
                for (let img of imagesToDelete) {
                    // Delete from storage
                    const url = new URL(img.image_url);
                    const path = url.pathname.split('/project-images/')[1];
                    await db.storage.from('project-images').remove([path]);

                    // Delete from database
                    await db.from('project_image').delete().eq('id', img.id);
                }
            }
        }

        // Upload new images
        if (newImages.length > 0) {
            const currentMaxPosition = currentEditingImages.length > 0
                ? Math.max(...currentEditingImages.map(img => img.position || 0))
                : -1;

            const imageInserts = [];

            for (let i = 0; i < newImages.length; i++) {
                const file = newImages[i];
                const path = `${projectId}/${Date.now()}-${file.name}`;

                const { data: upload, error: uploadError } = await db.storage
                    .from('project-images')
                    .upload(path, file);

                if (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    continue;
                }

                const { data: urlData } = db.storage
                    .from('project-images')
                    .getPublicUrl(upload.path);

                imageInserts.push({
                    project_id: projectId,
                    image_url: urlData.publicUrl,
                    position: currentMaxPosition + i + 1
                });
            }

            if (imageInserts.length > 0) {
                const { error: imgError } = await db
                    .from('project_image')
                    .insert(imageInserts);

                if (imgError) throw imgError;
            }
        }

        alert(currentEditingProjectId ? 'Project bijgewerkt!' : 'Project aangemaakt!');
        closeModal();
        loadAndDisplayProjects();
    } catch (error) {
        console.error('Error saving project:', error);
        alert('Error saving project: ' + error.message);
    }
}

// Close modal
function closeModal() {
    document.getElementById('project-modal').classList.add('hidden');
    currentEditingProjectId = null;
    currentEditingImages = [];
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayProjects();

    // Modal controls
    document.getElementById('add-project-btn').addEventListener('click', openAddProjectModal);
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('project-form').addEventListener('submit', saveProject);

    // Close modal when clicking outside
    document.getElementById('project-modal').addEventListener('click', (e) => {
        if (e.target.id === 'project-modal') {
            closeModal();
        }
    });
});
