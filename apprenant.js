import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faYen, faHome, faSignInAlt, faLanguage, faBook, faQuestionCircle, faShoppingCart, faDownload, faArrowAltCircleUp } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Grid, IconButton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';
import logo1 from './logo1.jpg';
import { Modal, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
// Importez vos images ici
import sciencemat from './sciencemat.PNG';
import langue from './langue.PNG';
import computer from './computer.PNG';
import art from './art.PNG';
import social from './social.PNG';
import economic from './economic.PNG';
import langpsycho from './psycho.PNG';
import cuisine from './cuisine.PNG';
import maquillage from './maquillage.PNG';
import motivationalMusic from './Motivation.mp3'; // Import de la musique
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Typography, CircularProgress, Alert, Card, CardContent, CardHeader, Avatar } from '@mui/material';



const Sidebar = ({ option, setOption }) => {
  const { t } = useTranslation('app');

  return (
    <div className="sidebar2">
      <div className='brand'>
        <br /> <img src={logo1} alt="logo1" /> <br /><br /><br />
      </div>
      <div className={option === 'profile' ? 'active' : ''} onClick={() => setOption('profile')}>
        <FontAwesomeIcon icon={faUser} /> {t('Mon profile')}
      </div><br />
      <div className={option === 'courses' ? 'active' : ''} onClick={() => setOption('courses')}>
        <FontAwesomeIcon icon={faBook} /> {t('Catalogue de cours')}
      </div><br />
      <div className={option === 'quiz' ? 'active' : ''} onClick={() => setOption('quiz')}>
        <FontAwesomeIcon icon={faQuestionCircle} /> {t('Quiz')}
      </div><br />
      <div
        className={option === 'achat' ? 'active' : ''}
        onClick={() => setOption('achat')}
      >
        <FontAwesomeIcon icon={faShoppingCart} />
        {t('Liste des achats')}
      </div>
    </div>
  );
};

const Apprenant = () => {
  const [option, setOption] = useState('courses');
  const [activeNavItem, setActiveNavItem] = useState(null);
  const { t, i18n } = useTranslation('apprenant');
  const [languageDropdownVisible, setLanguageDropdownVisible] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const audioRef = useRef(null);
  const [currentPage, setCurrentPage] = useState('catalogue');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOriginalLanguage, setSelectedOriginalLanguage] = useState('');
  const [courses, setCourses] = useState([]); // État pour stocker les cours associés au domaine sélectionné
  const [comments, setComments] = useState({});
  const [courseComments, setCourseComments] = useState([]);
  // Ajoutez un nouvel état pour contrôler l'affichage de la modal
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [user, setUser] = useState({});
  const [translateResponse, setTranslateResponse] = useState(null);
  const [viewCourseStatus, setViewCourseStatus] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')));
  }, []);

  const handleAnswerSelection = (selectedOption, correctAnswer) => {
    if (selectedOption === correctAnswer) {
      // Si la réponse est correcte, incrémentez le score de 1
      setQuizScore((prevScore) => prevScore + 1);
    }
  };




  useEffect(() => {
    // Votre logique pour récupérer les cours depuis l'API

    // Mettez à jour l'état des commentaires avec un objet vide pour chaque cours
    const initialCommentsState = {};
    courses.forEach(course => {
      initialCommentsState[course._id] = '';
    });
    setComments(298);
  }, [courses]);

  const handleOriginalLanguageChange = (event) => {
    setSelectedOriginalLanguage(event.target.value);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setCurrentPage('categoryDetail');

    try {
      const response = await axios.get(`http://localhost:3001/api/getcours?domaine=${category.name}`);
      const filteredCourses = response.data.filter(course => course.domaine === category.name);
      setCourses(filteredCourses);
      if (filteredCourses.length > 0) {
        const firstCourse = filteredCourses[0];
        await fetchInstructorName(firstCourse); // Wait for instructor name to be fetched
        setCourse(firstCourse); // Set the first course as the default selected course
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des cours :", error);
      // Handle errors appropriately
    }
  };




  const [showScoreModal, setShowScoreModal] = useState(false);


  // Fonction pour ouvrir la modal du score
  const handleShowScoreModal = () => {
    setShowScoreModal(true);
  };

  const handleCloseScoreModal = () => {
    setShowScoreModal(false);
  };

  const [quizFinalScore, setQuizFinalScore] = useState(0);

  // Mettez à jour la fonction handleFinishQuiz pour calculer le score final et afficher la modal du score
  const handleFinishQuiz = () => {
    if (!selectedQuiz) {
      return;
    }
    const finalScore = (quizScore / selectedQuiz.questions.length) * 100;
    console.log('Score final:', finalScore);
    // Mettez à jour l'état du score final
    setQuizFinalScore(finalScore);
    // Réinitialisez le score du quiz
    setQuizScore(0);
    // Activez la modal du score
    setShowScoreModal(true);
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/quizzes');
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error('Erreur lors de la récupération des quiz :', error);
      }
    };

    if (option === 'quiz') {
      fetchQuizzes();
    }
  }, [option]);

  useEffect(() => {
    if (selectedQuiz) {

    }
  }, [selectedQuiz]);



  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/logout'); // Appeler votre API de déconnexion

      if (response.data.success) {
        // Si la déconnexion est réussie, rediriger vers la page d'accueil
        sessionStorage.setItem('token', '');
        sessionStorage.setItem('user', {});
        navigate('/');
      } else {
        // Sinon, afficher un message d'erreur ou gérer l'erreur selon votre cas
        console.error('Erreur lors de la déconnexion :', response.data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };
  const toggleLanguageDropdown = () => {
    setLanguageDropdownVisible(!languageDropdownVisible);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleNavItemClick = (item) => {
    setActiveNavItem(item);
    setLanguageDropdownVisible(false);
  };

  const categories = [
    { id: 1, name: t('sciences_math'), image: sciencemat },
    { id: 2, name: t('langues'), image: langue },
    { id: 3, name: t('informatique_technologie'), image: computer },
    { id: 4, name: t('arts_culture'), image: art },
    { id: 5, name: t('developpement_personnel'), image: social },
    { id: 6, name: t('affaires_economie'), image: economic },
    { id: 7, name: t('sciences_sociales'), image: langpsycho },
    { id: 8, name: t('cuisine'), image: cuisine },
    { id: 9, name: t('maquillage'), image: maquillage }
  ];

  const [selectedLanguage, setSelectedLanguage] = useState('');


  const handleViewFile = (fileName) => {
    // Effectuer une requête GET vers l'API pour récupérer le contenu du fichier
    fetch(`http://localhost:3001/api/file-content?fileName=${fileName}`)
      .then(response => {
        // Vérifier si la réponse est réussie
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du fichier');
        }
        // Récupérer le contenu du fichier à partir de la réponse
        return response.text();
      })
      .then(fileContent => {
        // Ouvrir une nouvelle fenêtre ou un nouvel onglet avec le contenu du fichier
        window.open().document.write(fileContent);
      })
      .catch(error => {
        // Gérer les erreurs
        console.error('Erreur lors de la récupération du fichier :', error);
        // Afficher un message d'erreur à l'utilisateur
        toast.error('Erreur lors de la récupération du fichier');
      });
  };




  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    // Faites quelque chose avec la langue sélectionnée...
  };



  const [comment, setComment] = useState('');

  // Récupérer l'ID du cours à partir des paramètres d'URL
  const { id_cours } = useParams();
  const { id } = useParams();

  const handleCommentSubmit = async (courseId, apprenantId) => {
    try {

      // Vérifier si les données d'entrée sont valides
      if (!courseId || !apprenantId) {
        throw new Error('Identifiant de cours ou d\'apprenant invalide');
      }

      // Récupérer le commentaire du cours spécifié
      const commentValue = comments[courseId];

      // Effectuer une requête API pour ajouter le commentaire au cours
      const response = await axios.post(`http://localhost:3001/api/${courseId}/commentaires`, {
        commentaire: commentValue,
        apprenantId: apprenantId // Inclure l'ID de l'apprenant actuellement connecté
      });

      // Mettre à jour localement les commentaires avec le nouveau commentaire ajouté
      fetchCommentsForCourses();

      // Réinitialiser le champ de commentaire après la soumission réussie
      setComments(prevState => ({
        ...prevState,
        [courseId]: ''
      }));

      // Afficher un message de succès
      toast.success('Commentaire soumis avec succès!');

      // Retourner les données renvoyées par l'API
      return response.data;
    } catch (error) {
      // Gérer les erreurs
      console.error('Erreur lors de la soumission du commentaire :', error);
      // Afficher un message d'erreur
      toast.error('Erreur lors de la soumission du commentaire');
      // Retourner null ou gérer l'erreur selon les besoins de votre application
      return null;
    }
  };



  useEffect(() => {
    fetchCommentsForCourses();
  }, [courses]);

  const fetchCommentsForCourses = async () => {
    const commentsMap = {};
    for (const course of courses) {
      try {
        const response = await axios.get(`http://localhost:3001/api/${course._id}/GETcommentaires`);
        commentsMap[course._id] = response.data.commentaires;
      } catch (error) {
        console.error(`Erreur lors de la récupération des commentaires pour le cours ${course._id}:`, error);
        commentsMap[course._id] = [];
      }
    }

    setCourseComments(commentsMap);
  };


  const handleCommentChange = (event, courseId) => {
    const { value } = event.target;
    setComments(prevState => ({
      ...prevState,
      [courseId]: value
    }));
  };


  const handleShowComments = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/${courseId}/GETcommentaires`);
      const comments = response.data.commentaires;
      setCourseComments(comments);
      setShowCommentsModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires :', error);
    }
  };

  const [showModal5, setShowModal5] = useState(false);


  // Fonction pour ouvrir la modal du score
  const handleShowModal5 = () => {
    setTranslateResponse(null);
    setViewCourseStatus(false);
    setShowModal5(true);
  };

  const handleCloseModal5 = () => {
    setShowModal5(false);
  };


  const [course, setCourse] = useState(null);


  const [instructorName, setInstructorName] = useState('Instructeur non défini');
  const [instructors, setInstructors] = useState([]);

  const fetchInstructorName = async (course) => {
    if (course && course.instructeur) {
      try {
        console.log("Fetching instructor for ID:", course.instructeur);
        const response = await axios.get(`http://localhost:3001/api/instructors`);
        setInstructors(response.data.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du nom de l\'instructeur :', error);
        setInstructorName('Erreur lors de la récupération du nom de l\'instructeur');

      }
    } else {
      console.log("Course or course.instructeur is not defined:", course);
      setInstructorName('Instructeur non défini');
    }
  };

  const getInstructorById = (id) => {
    return instructors.find(element => element._id === id)?.nom;
  }





  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [apprenantId, setApprenantId] = useState(null);
  const [coursId, setCoursId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [coursePurchased, setCoursePurchased] = useState(false);


  const handleConfirm = async (selectedCourseId) => {
    setLoading(true);
    setMessage('');

    if (!apprenantId || !selectedCourseId) {
      setMessage("ID d'apprenant ou ID de cours non fourni");
      setLoading(false);
      return;
    }

    try {
      const selectedCourse = courses.find(course => course._id === selectedCourseId);

      if (!selectedCourse) {
        setMessage("Cours non trouvé");
        setLoading(false);
        return;
      }

      const achatData = {
        apprenantId: apprenantId,
        coursId: selectedCourseId,
        montant: selectedCourse.prix,
        dateA: new Date().toISOString().split('T')[0]
      };

      console.log('Sending achat data:', achatData);

      const response = await axios.post('http://localhost:3001/api/ajouter-achat', achatData);

      console.log('Réponse de la requête:', response);

      if (response.status === 200 && response.data.message === "Achat ajouté avec succès") {
        Swal.fire('Succès', 'Vous avez acheté le cours', 'success');
        setMessage('Cours acheté avec succès');
        setCoursePurchased(true); // Définir l'état d'achat sur vrai
      } else {
        console.log('Erreur lors de l\'achat:', response.data.message);
        setMessage(response.data.message || 'Erreur lors de l\'achat du cours');
      }
    } catch (error) {
      // Gestion des erreurs
    } finally {
      setLoading(false);
    }
  };



  const showConfirmation = (selectedCourseId) => {
    Swal.fire({
      title: 'Confirmer l\'achat',
      text: 'Êtes-vous sûr de vouloir acheter ce cours ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, acheter !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        handleConfirm(selectedCourseId);
      }
    });
  };

  const handleShow = (event) => {
    const selectedCourseId = event.currentTarget.getAttribute('data-course-id');
    if (user && user._id && courses && courses.length > 0 && selectedCourseId) {
      setApprenantId(user._id);
      setCoursId(selectedCourseId);
      showConfirmation(selectedCourseId);
    } else {
      console.warn('User ID or Course ID is missing');
    }
  };



  const [apprenant, setApprenant] = useState(null);

  const [error, setError] = useState(null);
  useEffect(() => {
    if (option === 'profile') {
      const fetchApprenant = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:3001/api/getApprenants');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const apprenants = await response.json();
          const apprenantConnecte = apprenants.find(apprenant => apprenant.nom === user?.name);
          if (!apprenantConnecte) {
            throw new Error('Apprenant non trouvé');
          }
          setApprenant(apprenantConnecte);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchApprenant();
    }
  }, [option, user?.name]);


  //////////////////////////liste achat 
  const [coursAchetes, setCoursAchetes] = useState([]);


  useEffect(() => {
    const fetchCoursAchetes = async () => {
      try {
        if (option !== 'achat' || !user?.name) return;

        const response = await fetch(`http://localhost:3001/apprenants/${user.name}/cours-achetes`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des cours achetés');
        }
        const data = await response.json();
        setCoursAchetes(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        // Gérer les erreurs de récupération
        setLoading(false);
      }
    };

    fetchCoursAchetes();
  }, [option, user?.name]);




  ///////////////////////////////////:traduction////////////
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleTranslate = async (fichier, targetLanguage) => {
    try {
      if (!targetLanguage) {
        console.error('Veuillez sélectionner une langue cible.');
        return;
      }

      // if (!file) {
      //   console.error('Aucun fichier sélectionné.');
      //   return;
      // }

      const formData = new FormData();
      formData.append('file', fichier);
      formData.append('targetLanguage', targetLanguage);

      const response = await fetch('http://localhost:3001/translate-text-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Erreur lors de la traduction du fichier.');
        return;
      }

      const data = await response.json();
      setTranslateResponse(data);
      console.log('Texte traduit :', data.translatedText);
    } catch (error) {
      console.error('Erreur lors de la traduction :', error);
    }
  };
  const [fileContent, setFileContent] = useState('');
  const fetchFileText = async (fileName) => {
    try {
      console.log(`Fetching file content for: ${fileName}`); // Log the filename
      const response = await axios.get(`http://localhost:3001/api/file-content2?fileName=${fileName}`);
      console.log('File content fetched successfully:', response.data); // Log the response data
      setFileContent(response.data); // Update the file content in state
    } catch (error) {
      console.error('Error fetching file content:', error); // Log the error
    }
  };

  const handleViewCourse = (fileName) => {
    setViewCourseStatus(true);
    console.log(`View course for file: ${fileName}`); // Log the filename
    // fetchFileText(fileName); // Call the function to fetch the translated file content
  };

  /////////////telechargement///////////////////
  const downloadCourse = (courseId) => {
    const apiUrl = `http://localhost:3001/download-file/${courseId}`;
    console.log('okk apiUrl : ', apiUrl);

    const link = document.createElement('a');
    link.href = apiUrl;
    link.setAttribute('download', '');

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const handleDownloadClick = () => {
    downloadCourse(course?._id);
  };



  return (
    <div className="accueil-container">
      <Sidebar option={option} setOption={setOption} />
      <div className="main-content">
        <div className="navbar">
          <div className="left-links">
            <h4 className="titre">Intellego</h4> &nbsp; &nbsp; &nbsp;
            <div
              className={`nav-item ${activeNavItem === 'home' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('home')}
            >
              <FontAwesomeIcon icon={faHome} /> {t('accueil')}
            </div>
          </div>
          <div className="right-links">
            <div
              className={`nav-item ${activeNavItem === 'deconnexion' ? 'active' : ''}`}
              onClick={handleLogout}>

              <FontAwesomeIcon icon={faSignInAlt} /> {t('Déconnexion')}
            </div>

            <div
              className={`nav-item ${activeNavItem === 'user' ? 'active' : ''}`}
            >

              <FontAwesomeIcon icon={faUser} />  {user?.name}
            </div>





            <div
              className={`nav-item ${activeNavItem === 'language' ? 'active' : ''}`}
              onClick={() => {
                handleNavItemClick('language');
                toggleLanguageDropdown();
              }}
            >
              <FontAwesomeIcon icon={faLanguage} /> {t('langue')}
              {languageDropdownVisible && (
                <div className="language-dropdown">
                  <ul>
                    <li onClick={() => changeLanguage('en')}>{t('anglais')}</li>
                    <li onClick={() => changeLanguage('fr')}>{t('francais')}</li>
                    <li onClick={() => changeLanguage('ar')}>{t('arabe')}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <br /><br />




        {option === 'achat' && (
  <Container maxWidth="lg">
    <Typography variant="h4" align="center" gutterBottom className='taille'>Liste des cours achetés</Typography>
    {loading ? (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </div>
    ) : (
      <Grid container spacing={3}>
        {coursAchetes.length > 0 ? (
          coursAchetes.map(cours => (
            <Grid item xs={12} sm={6} md={4} key={cours?.id_cours}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {cours ? cours.titre : 'Titre non disponible'}
                  </Typography>

                  <Typography variant="body2">
                    {cours ? `Domaine: ${cours.domaine}` : ''}
                  </Typography>
                  {/* Ajoutez d'autres détails du cours ici si nécessaire */}
                </CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <IconButton aria-label="Ajouter au panier">
                    <ShoppingCart />
                  </IconButton>
                  <IconButton aria-label="Traduire le cours" onClick={() => handleShowModal5(cours)}>
                    <TranslateIcon />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" align="center">Aucun cours acheté trouvé pour cet apprenant.</Typography>
        )}
      </Grid>
    )}
  </Container>
)}

<Modal show={showModal5} onHide={handleCloseModal5}>
  <Modal.Header closeButton>
    <Modal.Title>Traduction de cours</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="mb-3">
      <label htmlFor="language" className="form-label">Langue du fichier</label>
      <select
        className="form-select"
        id="language"
        value={selectedOriginalLanguage}
        onChange={handleOriginalLanguageChange}
      >
        <option value="">Sélectionner une langue</option>
        
                              <option value="af">Afrikaans</option>
                              <option value="ar">Arabic</option>
                              <option value="hy">Armenian</option>
                              <option value="as">Assamese</option>
                              <option value="ay">Aymara</option>
                              
      </select>
    </div>
    <div className='d-flex'>
      <div className="btn-translate">
        <button
          style={{ fontSize: 30, backgroundColor: 'white', color: 'black' }}
          onClick={() => handleTranslate(course.fichier, selectedOriginalLanguage)}
        >
          <TranslateIcon />
        </button>
      </div>
      {!!translateResponse && (
        <>
          <div className="btn-download">
            <button
              id="votre_bouton_id"
              onClick={handleDownloadClick}
              data-toggle="tooltip"
              data-placement="top"
              title="Télécharger"
              style={{ fontSize: 30, backgroundColor: 'white', color: 'black' }}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div>
        </>
      )}
    </div>
    {!!translateResponse && <div className="lien">
      <a href="#" onClick={() => handleViewCourse(course.fichier)}>Voir le cours traduit</a>
    </div>}
    {viewCourseStatus && <p>{translateResponse.translatedText}</p>}
  </Modal.Body>

</Modal>


        {option === 'profile' && (
          <>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">Error: {error.message}</Alert>}
            {apprenant && (
              <Container style={{ height: '100vh' }}> {/* Ajustez la hauteur du conteneur selon vos besoins */}
                <Card sx={{ width: 600, margin: 'auto' }}> {/* Ajustez la largeur de la carte selon vos besoins */}
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'orange', width: 100, height: 100, fontSize: 50 }}>
                        {apprenant.nom.charAt(0)}
                      </Avatar>

                    }
                    title={<Typography variant="h4" sx={{ fontWeight: 'bold' }}>{`Profil de ${apprenant.nom}`}</Typography>} // Utilisation de Typography pour rendre le titre en gras
                  />
                  <CardContent>
                    <Typography variant="body1"><strong>Email:</strong> {apprenant.email}</Typography>
                    <Typography variant="body1"><strong>Langue:</strong> {apprenant.langue}</Typography>
                    <Typography variant="body1"><strong>Statut:</strong> {apprenant.statut}</Typography>
                    <Typography variant="body1"><strong>Niveau:</strong> {apprenant.niveau}</Typography>
                    <Typography variant="body1"><strong>Ville:</strong> {apprenant.ville}</Typography>
                    <Typography variant="body1"><strong>Date de Naissance:</strong> {new Date(apprenant.dateNaiss).toLocaleDateString()}</Typography>
                    {/* Ajoutez d'autres champs selon vos données */}
                  </CardContent>
                </Card>
              </Container>

            )}
          </>
        )}



        {option === 'courses' && (
          <div>
            {currentPage === 'catalogue' && (
              <div>
                <h1 className="taille"><center>{t('catalogue')}</center></h1> <br /><br />
                <div className="grid-container">
                  {categories.map((category) => (
                    <div className="grid-item" key={category.id} onClick={() => handleCategoryClick(category)}>
                      <br />
                      <h3><b>{category.name}</b></h3>
                      <img src={category.image} alt={category.name} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentPage === 'categoryDetail' && (
              <div>
                <h1 className="taille"><center>{selectedCategory.name}</center></h1>
                <br /><br />
                <div className="grid-container">
                  {courses.map((course) => (
                    <div className="grid-item" key={course._id}>
                      <h2><p>{course.titre}</p></h2>
                      <p><b>Instructeur:</b> {getInstructorById(course?.instructeur)}</p>
                      <p><b>Prix:</b> {course.prix}</p>
                      <p><b>Langue:</b> {course.langue}</p>
                      <div key={course._id}>
                        <p>{course.name}</p>
                        <button
                          className="btn-acheter" data-toggle="tooltip" data-placement="top" title="Acheter" style={{ fontSize: 30, backgroundColor: 'white', color: 'black' }}
                          data-course-id={course._id} onClick={handleShow}>
                          <FontAwesomeIcon icon={faShoppingCart} /></button> &nbsp;

                        {/*  {coursePurchased && (
            <button className="btn-telecharger" data-toggle="tooltip" data-placement="top" title="Traduire" onClick={handleShowModal5} style={{ fontSize: 50, backgroundColor: 'white', color: 'black' }}>
              <TranslateIcon />
            </button>
          )} */}


                        <button className="btn-telecharger" data-toggle="tooltip" data-placement="top" title="Traduire" onClick={handleShowModal5} style={{ fontSize: 50, backgroundColor: 'white', color: 'black' }}>
                          <TranslateIcon />
                        </button>



                      </div>







                      <Modal show={showModal5} onHide={handleCloseModal5}>
                        <Modal.Header closeButton>
                          <Modal.Title>Traduction de cours</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <div className="mb-3">
                            <label htmlFor="language" className="form-label">Langue du fichier</label>
                            <select
                              className="form-select"
                              id="language"
                              value={selectedOriginalLanguage}
                              onChange={handleOriginalLanguageChange}
                            >
                              <option value="">Sélectionner une langue</option>
                              <option value="af">Afrikaans</option>
                              <option value="ar">Arabic</option>
                              <option value="hy">Armenian</option>
                              <option value="as">Assamese</option>
                              <option value="ay">Aymara</option>
                              <option value="az">Azerbaijani</option>
                              <option value="bm">Bambara</option>
                              <option value="eu">Basque</option>
                              <option value="be">Belarusian</option>
                              <option value="bn">Bengali</option>
                              <option value="bho">Bhojpuri</option>
                              <option value="bs">Bosnian</option>
                              <option value="bg">Bulgarian</option>
                              <option value="ca">Catalan</option>
                              <option value="ceb">Cebuano</option>
                              <option value="ny">Chichewa</option>
                              <option value="zh-CN">Chinese (Simplified)</option>
                              <option value="zh-TW">Chinese (Traditional)</option>
                              <option value="co">Corsican</option>
                              <option value="hr">Croatian</option>
                              <option value="cs">Czech</option>
                              <option value="da">Danish</option>
                              <option value="dv">Dhivehi</option>
                              <option value="doi">Dogri</option>
                              <option value="nl">Dutch</option>
                              <option value="en">English</option>
                              <option value="eo">Esperanto</option>
                              <option value="et">Estonian</option>
                              <option value="ee">Ewe</option>
                              <option value="tl">Filipino</option>
                              <option value="fi">Finnish</option>
                              <option value="fr">French</option>
                              <option value="fy">Frisian</option>
                              <option value="gl">Galician</option>
                              <option value="ka">Georgian</option>
                              <option value="de">German</option>
                              <option value="el">Greek</option>
                              <option value="gn">Guarani</option>
                              <option value="gu">Gujarati</option>
                              <option value="ht">Haitian Creole</option>
                              <option value="ha">Hausa</option>
                              <option value="haw">Hawaiian</option>
                              <option value="iw">Hebrew</option>
                              <option value="hi">Hindi</option>
                              <option value="hmn">Hmong</option>
                              <option value="hu">Hungarian</option>
                              <option value="is">Icelandic</option>
                              <option value="ig">Igbo</option>
                              <option value="ilo">Ilocano</option>
                              <option value="id">Indonesian</option>
                              <option value="ga">Irish</option>
                              <option value="it">Italian</option>
                              <option value="ja">Japanese</option>
                              <option value="jw">Javanese</option>
                              <option value="kn">Kannada</option>
                              <option value="kk">Kazakh</option>
                              <option value="km">Khmer</option>
                              <option value="rw">Kinyarwanda</option>
                              <option value="gom">Konkani</option>
                              <option value="ko">Korean</option>
                              <option value="kri">Krio</option>
                              <option value="ku">Kurdish (Kurmanji)</option>
                              <option value="ckb">Kurdish (Sorani)</option>
                              <option value="ky">Kyrgyz</option>
                              <option value="lo">Lao</option>
                              <option value="la">Latin</option>
                              <option value="lv">Latvian</option>
                              <option value="ln">Lingala</option>
                              <option value="lt">Lithuanian</option>
                              <option value="lg">Luganda</option>
                              <option value="lb">Luxembourgish</option>
                              <option value="mk">Macedonian</option>
                              <option value="mai">Maithili</option>
                              <option value="mg">Malagasy</option>
                              <option value="ms">Malay</option>
                              <option value="ml">Malayalam</option>
                              <option value="mt">Maltese</option>
                              <option value="mi">Maori</option>
                              <option value="mr">Marathi</option>
                              <option value="mni-Mtei">Meiteilon (Manipuri)</option>
                              <option value="lus">Mizo</option>
                              <option value="mn">Mongolian</option>
                              <option value="my">Myanmar</option>
                              <option value="ne">Nepali</option>
                              <option value="no">Norwegian</option>
                              <option value="or">Odia (Oriya)</option>
                              <option value="om">Oromo</option>
                              <option value="ps">Pashto</option>
                              <option value="fa">Persian</option>
                              <option value="pl">Polish</option>
                              <option value="pt">Portuguese</option>
                              <option value="pa">Punjabi</option>
                              <option value="qu">Quechua</option>
                              <option value="ro">Romanian</option>
                              <option value="ru">Russian</option>
                              <option value="sm">Samoan</option>
                              <option value="sa">Sanskrit</option>
                              <option value="gd">Scots Gaelic</option>
                              <option value="nso">Sepedi</option>
                              <option value="sr">Serbian</option>
                              <option value="st">Sesotho</option>
                              <option value="sn">Shona</option>
                              <option value="sd">Sindhi</option>
                              <option value="si">Sinhala</option>
                              <option value="sk">Slovak</option>
                              <option value="sl">Slovenian</option>
                              <option value="so">Somali</option>
                              <option value="es">Spanish</option>
                              <option value="su">Sundanese</option>
                              <option value="sw">Swahili</option>
                              <option value="sv">Swedish</option>
                              <option value="tg">Tajik</option>
                              <option value="ta">Tamil</option>
                              <option value="tt">Tatar</option>
                              <option value="te">Telugu</option>
                              <option value="th">Thai</option>
                              <option value="ti">Tigrinya</option>
                              <option value="ts">Tsonga</option>
                              <option value="tr">Turkish</option>
                              <option value="tk">Turkmen</option>
                              <option value="ak">Twi</option>
                              <option value="uk">Ukrainian</option>
                              <option value="ur">Urdu</option>
                              <option value="ug">Uyghur</option>
                              <option value="uz">Uzbek</option>
                              <option value="vi">Vietnamese</option>
                              <option value="cy">Welsh</option>
                              <option value="xh">Xhosa</option>
                              <option value="yi">Yiddish</option>
                              <option value="yo">Yoruba</option>
                              <option value="zu">Zulu</option>
                            </select>
                          </div>
                          {/* <div className="mb-3">
                            <label htmlFor="fileInput" className="form-label">Télécharger un fichier</label>
                            <input
                              type="file"
                              className="form-control"
                              id="fileInput"
                              onChange={handleFileChange}
                            />
                          </div> */}
                          <div className='d-flex'>
                            <div className="btn-translate">
                              <button
                                style={{ fontSize: 30, backgroundColor: 'white', color: 'black' }}
                                onClick={() => handleTranslate(course.fichier, selectedOriginalLanguage)}
                              >
                                <TranslateIcon />
                              </button>
                            </div>
                            {!!translateResponse && <div className="btn-download">
                              <button
                                id="votre_bouton_id"
                                onClick={handleDownloadClick}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Télécharger"
                                style={{ fontSize: 30, backgroundColor: 'white', color: 'black' }}
                              >
                                <FontAwesomeIcon icon={faDownload} />
                              </button>
                            </div>}
                          </div>
                          {!!translateResponse && <div className="lien">
                            <a href="#" onClick={() => handleViewCourse(course.fichier)}>Voir le cours traduit</a>
                          </div>}
                          {viewCourseStatus && <p>{translateResponse.translatedText}</p>}
                        </Modal.Body>
                      </Modal>



                      <h3>Commentaires:</h3><br />
                      <div style={{ maxHeight: '100px', overflowY: 'auto' }}>

                        {/* Vérifiez si la liste des commentaires est définie et n'est pas vide */}
                        {courseComments[course._id] && Object.keys(courseComments[course._id]).length !== 0 ? (
                          // Utilisez Object.values pour obtenir un tableau de commentaires
                          Object.values(courseComments[course._id]).map((comment, index) => {
                            return <div key={comment?._id}> {/* Utilisez un identifiant unique pour chaque commentaire */}
                              {/* Afficher chaque commentaire */}
                              <p><b>{comment?.apprenant?.nom || 'Unknown User'} : </b> {comment?.commentaire}</p>

                            </div>
                          })
                        ) : (
                          <p>Pas de commentaires disponibles</p>
                        )}
                      </div>




                      <br />
                      <br /><br />
                      {/* Champ de commentaire indépendant pour chaque cours */}
                      <div style={{ position: 'relative', width: '100%' }}>
                        <textarea
                          rows="4"
                          placeholder="Entrez votre commentaire ici..."
                          value={comments[course._id] || ''} // Assurez-vous que chaque champ de commentaire a une valeur par défaut
                          onChange={(e) => handleCommentChange(e, course._id)} // Passez l'ID du cours
                          style={{ width: '100%' }}
                        />

                        <button
                          onClick={() => handleCommentSubmit(course._id, user._id)} data-toggle="tooltip" data-placement="top" title="Commenter"
                          style={{ position: 'absolute', fontSize: 20, bottom: 10, right: 10, padding: '8px 13px', backgroundColor: 'white', color: 'black' }} // Positionnez le bouton en bas à 
                        >
                          <FontAwesomeIcon icon={faArrowAltCircleUp} />
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}





        {option === 'quiz' && (
          <div>
            <h1 className="taille"><center>{t('quiz')}</center></h1>
            <br /><br /><br /><br />
            <div className="grid-container">
              {quizzes?.map((quiz, index) => (
                <div className="grid-item" key={quiz._id}>
                  <div onClick={() => setSelectedQuiz(quiz)} style={{ cursor: 'pointer' }}>
                    <p className='tit'>{quiz.titre}</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedQuiz && (
              <Modal show={true} onHide={() => setSelectedQuiz(null)}>
                <Modal.Header closeButton>
                  <Modal.Title>{selectedQuiz.titre}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                  <form>
                    {selectedQuiz.questions.map((question, index) => (
                      <div key={index}>
                        <h4><p><b><span style={{ color: '#2E8B57' }}>Question {index + 1}:</span></b></p></h4>
                        <p>{question.text}</p>
                        {question.suggestions.map((suggestion, optionIndex) => (
                          <div key={optionIndex} style={{ display: 'inline-block', marginRight: '1rem' }}>
                            <input
                              type="radio"
                              id={`suggestion-${index}-${optionIndex}`}
                              name={`question-${index}`}
                              value={suggestion}
                              onChange={() => handleAnswerSelection(suggestion, question.correctAnswer)}
                            />
                            <label htmlFor={`suggestion-${index}-${optionIndex}`} style={{ marginLeft: '0.5rem' }}>{suggestion}</label>
                          </div>
                        ))}
                        <br /><br />
                      </div>
                    ))}
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={() => { handleFinishQuiz(); setSelectedQuiz(null); handleShowScoreModal(); }}>
                    Terminer le Quiz
                  </Button>
                </Modal.Footer>
              </Modal>




            )}
            <Modal show={showScoreModal} onHide={handleCloseScoreModal}>
              <Modal.Header closeButton>
                <Modal.Title>Résultat du Quiz</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Utilisez l'état du score final pour afficher le score dans la modal */}
                <h2>
                  <center>
                    {t('Votre score')}: {quizFinalScore.toFixed(0)}/100
                    {/* Condition pour afficher un message "Bravo" si le score est de 100 */}
                    <br /><br />
                    {(quizFinalScore === 100 && (
                      <span>
                        {' '}
                        Bravo!{' '}
                        <span role="img" aria-label="smiley">
                          😊
                        </span>
                      </span>
                    )) || (quizFinalScore >= 80 && quizFinalScore < 100 && (
                      <span>
                        {' '}
                        Excellent travail!{' '}
                        <span role="img" aria-label="smiley">
                          👍
                        </span>
                      </span>
                    )) || (quizFinalScore >= 60 && quizFinalScore < 80 && (
                      <span>
                        {' '}
                        Pas mal!{' '}
                        <span role="img" aria-label="smiley">
                          😃
                        </span>
                      </span>
                    )) || (quizFinalScore > 0 && quizFinalScore < 60 && (
                      <span>
                        {' '}
                        Vous pouvez faire mieux!{' '}
                        <span role="img" aria-label="smiley">
                          😕
                        </span>
                      </span>
                    )) || (quizFinalScore === 0 && (
                      <span>
                        {' '}
                        Essayez encore!{' '}
                        <span role="img" aria-label="smiley">
                          😔
                        </span>
                      </span>
                    ))}


                  </center>
                </h2>
              </Modal.Body>
            </Modal>

          </div>
        )}
      </div>

    </div>

  );

};

export default Apprenant;