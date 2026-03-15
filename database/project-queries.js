import { db } from './connection.js'


// ─── Create ─────────────────────────────────────────────────────────────────

async function addProject() {
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const files = document.getElementById('images').files

    // 1. Project aanmaken
    const { data: project, error } = await db
        .from('project')
        .insert({ title, description })
        .select()
        .single()

    if (error) return alert('Fout bij aanmaken project: ' + error.message)

    // 2. Afbeeldingen uploaden naar Storage bucket "project-images"
    const imageInserts = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const path = `${project.id}/${Date.now()}-${file.name}`

        const { data: upload, error: uploadError } = await db.storage
            .from('project-images')
            .upload(path, file)

        if (uploadError) {
            alert('Fout bij uploaden foto: ' + uploadError.message)
            continue
        }

        const { data: urlData } = db.storage
            .from('project-images')
            .getPublicUrl(upload.path)

        imageInserts.push({
            project_id: project.id,
            image_url: urlData.publicUrl,
            position: i
        })
    }

    // 3. Afbeelding URLs opslaan in tabel "project_image"
    if (imageInserts.length > 0) {
        const { error: imgError } = await db
            .from('project_image')
            .insert(imageInserts)

        if (imgError) return alert('Fout bij opslaan afbeeldingen: ' + imgError.message)
    }

    alert('Project toegevoegd!')
    loadProjects()
}

// ─── Read ───────────────────────────────────────────────────────────────────

export async function loadProjects() {
    const { data: projects, error } = await db
        .from('project')
        .select(`
        id,
        title,
        description,
        created_at,
        project_image (
          id,
          image_url,
          position
        )
      `)
        .order('created_at', { ascending: false })

    if (error) return alert('Fout: ' + error.message)

    return projects;
}

// ─── Delete ─────────────────────────────────────────────────────────────────

async function deleteProject(id) {
    if (!confirm('Zeker weten?')) return

    // 1. Foto paden ophalen uit de database
    const { data: images } = await db
        .from('project_image')
        .select('image_url')
        .eq('project_id', id)

    // 2. Paden uit de publieke URLs halen en uit Storage verwijderen
    const paths = images.map(img => {
        const url = new URL(img.image_url)
        return url.pathname.split('/project-images/')[1]
    })

    if (paths.length > 0) {
        await db.storage.from('project-images').remove(paths)
    }

    // 3. Project verwijderen — project_image rijen gaan automatisch mee via CASCADE
    const { error } = await db
        .from('project')
        .delete()
        .eq('id', id)

    if (error) alert('Fout bij verwijderen: ' + error.message)
    else loadProjects()
}
window.addProject = addProject
window.loadProjects = loadProjects
window.deleteProject = deleteProject